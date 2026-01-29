import { Classroom } from '../../entities/classroom';
import { getConnectedClassroomsCount, getContributedClassroomsCount } from '../../stats/classroomStats';
import { getRegisteredClassroomsCount } from '../../stats/sessionStats';
import { AppDataSource } from '../../utils/data-source';
import {
  getDetailedActivitiesCountsByClassrooms,
  getDetailedActivitiesCountsByVillage,
  getDetailedActivitiesCountsByVillages,
} from './statistics.repository';

const classroomRepository = AppDataSource.getRepository(Classroom);

export const PHASES = [1, 2, 3];

const METRIC_LABELS: Record<string, string> = {
  commentCount: 'Commentaires sous les activités',
  draftCount: 'Brouillons',
  videoCount: 'Total vidéos produites',
  indiceCount: 'Indices',
  mascotCount: 'Mascottes',
  challengeCount: 'Défis',
  enigmaCount: 'Énigmes',
  gameCount: 'Jeux',
  questionCount: 'Questions',
  reactionCount: 'Réactions',
  reportingCount: 'Reportage',
  storyCount: 'Invention histoire',
  anthemCount: 'Couplet hymne',
  contentLibreCount: 'Contenus libres',
  reinventStoryCount: 'Histoires réinventées',
};

const ACTIVITY_KEYS_BY_PHASE: Record<number, string[]> = {
  1: ['mascotCount', 'indiceCount'],
  2: ['reportingCount', 'challengeCount', 'enigmaCount', 'gameCount', 'questionCount'],
  3: ['anthemCount', 'storyCount'],
};

type VillageInfo = { id: number; name: string };
type ClassroomInfo = { id: number; countryCode: string; label: string };

export async function fetchVillagesData(phases: number[]): Promise<VillageInfo[]> {
  const [villagesPhase1, villagesPhase2, villagesPhase3] = await Promise.all(phases.map((phaseId) => getDetailedActivitiesCountsByVillages(phaseId)));
  const villagesMap = new Map<number, VillageInfo>();
  [...villagesPhase1, ...villagesPhase2, ...villagesPhase3].forEach((village: any) => {
    if (village?.id && village?.name) villagesMap.set(village.id, { id: village.id, name: village.name });
  });
  return Array.from(villagesMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

export async function buildVillageCountriesMap(
  villages: VillageInfo[],
  countryLabelByCode: Map<string, string>,
  firstPhase: number,
): Promise<Map<number, string[]>> {
  const villageCountries = new Map<number, string[]>();
  await Promise.all(
    villages.map(async (village) => {
      const countriesDetails = await getDetailedActivitiesCountsByVillage(village.id, firstPhase);
      const codes = countriesDetails.map((country: any) => country.countryCode);
      const sortedByLabel = codes.sort((a: string, b: string) =>
        (countryLabelByCode.get(a) || a).localeCompare(countryLabelByCode.get(b) || b, 'fr'),
      );
      villageCountries.set(village.id, sortedByLabel);
    }),
  );
  return villageCountries;
}

export async function buildVillageClassroomsOrdered(
  villages: VillageInfo[],
  villageCountries: Map<number, string[]>,
  countryLabelByCode: Map<string, string>,
): Promise<Map<number, ClassroomInfo[]>> {
  const villageClassroomsOrdered = new Map<number, ClassroomInfo[]>();
  await Promise.all(
    villages.map(async (village) => {
      const classrooms = await classroomRepository.find({ where: { villageId: village.id }, relations: { user: true } });
      const classesNormalized = (classrooms || []).map((classroom) => {
        const code = (classroom as any).countryCode || (classroom.user as any)?.countryCode || '';
        const className = classroom.name ?? (classroom.user as any)?.displayName ?? `Classe n°${classroom.id}`;
        const country = countryLabelByCode.get(code) || code || '';
        return { id: classroom.id, countryCode: code, label: `${country} - ${className}` };
      });

      const codes = villageCountries.get(village.id) || [];
      const byCountry = new Map<string, ClassroomInfo[]>();
      classesNormalized.forEach((cl) => {
        const arr = byCountry.get(cl.countryCode) || [];
        arr.push(cl);
        byCountry.set(cl.countryCode, arr);
      });

      const ordered: ClassroomInfo[] = [];
      codes.forEach((code) => {
        const list = (byCountry.get(code) || []).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
        list.forEach((it) => ordered.push(it));
      });
      villageClassroomsOrdered.set(village.id, ordered);
    }),
  );
  return villageClassroomsOrdered;
}

export function buildCsvHeaders(
  villages: VillageInfo[],
  villageCountries: Map<number, string[]>,
  villageClassroomsOrdered: Map<number, ClassroomInfo[]>,
  countryLabelByCode: Map<string, string>,
): string[] {
  const headers: string[] = ['Phase', 'Indicateur'];
  villages.forEach((village) => {
    headers.push(village.name);
    const codes = villageCountries.get(village.id) || [];
    codes.forEach((code) => headers.push(countryLabelByCode.get(code) || code));
    const classCols = villageClassroomsOrdered.get(village.id) || [];
    classCols.forEach((cl) => headers.push(cl.label));
  });

  return headers;
}

export async function indexDataByPhase(phases: number[], villages: VillageInfo[]) {
  const byPhaseVillageData = await Promise.all(phases.map((phaseId) => getDetailedActivitiesCountsByVillages(phaseId)));
  const byPhaseVillage = byPhaseVillageData.map((list) => {
    const map = new Map<number, any>();
    list.forEach((village: any) => map.set(village.id, village.phaseDetails));
    return map;
  });

  const byPhaseVillageCountry: Array<Map<number, Map<string, any>>> = [];

  for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
    const phase = phases[phaseIndex];
    const mapForPhase = new Map<number, Map<string, any>>();

    await Promise.all(
      villages.map(async (village) => {
        const details = await getDetailedActivitiesCountsByVillage(village.id, phase);
        const countryMap = new Map<string, any>();
        details.forEach((country: any) => countryMap.set(country.countryCode, country.phaseDetails));
        mapForPhase.set(village.id, countryMap);
      }),
    );

    byPhaseVillageCountry.push(mapForPhase);
  }

  const byPhaseVillageClassroom: Array<Map<number, Map<number, any>>> = [];

  for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
    const phase = phases[phaseIndex];
    const mapForPhase = new Map<number, Map<number, any>>();

    await Promise.all(
      villages.map(async (village) => {
        const classDetails = await getDetailedActivitiesCountsByClassrooms(village.id, phase);
        const classroomMap = new Map<number, any>();
        (classDetails || []).forEach((classroom: any) => classroomMap.set(classroom.id, classroom.phaseDetails));
        mapForPhase.set(village.id, classroomMap);
      }),
    );

    byPhaseVillageClassroom.push(mapForPhase);
  }

  return { byPhaseVillage, byPhaseVillageCountry, byPhaseVillageClassroom };
}

export async function calculateConnectionCounts(
  phases: number[],
  villages: VillageInfo[],
  villageCountries: Map<number, string[]>,
  villageClassroomsOrdered: Map<number, ClassroomInfo[]>,
) {
  const connectedByPhaseVillage: Array<Map<number, number>> = [];
  const contributedByPhaseVillage: Array<Map<number, number>> = [];
  const connectedByPhaseVillageCountry: Array<Map<string, number>> = [];
  const contributedByPhaseVillageCountry: Array<Map<string, number>> = [];
  const connectedByPhaseClassroom: Array<Map<number, number>> = [];
  const contributedByPhaseClassroom: Array<Map<number, number>> = [];

  for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
    const phase = phases[phaseIndex];
    const connectedVillageMap = new Map<number, number>();
    const contributedVillageMap = new Map<number, number>();
    const connectedVillageCountryMap = new Map<string, number>();
    const contributedVillageCountryMap = new Map<string, number>();
    const connectedClassroomMap = new Map<number, number>();
    const contributedClassroomMap = new Map<number, number>();

    await Promise.all(
      villages.map(async (village) => {
        const [connectedCount, contributedCount] = await Promise.all([
          getConnectedClassroomsCount(village.id, undefined, undefined, phase as any),
          getContributedClassroomsCount(village.id, undefined, undefined, phase as any),
        ]);
        connectedVillageMap.set(village.id, typeof connectedCount === 'number' ? connectedCount : 0);
        contributedVillageMap.set(village.id, typeof contributedCount === 'number' ? contributedCount : 0);

        const codes = villageCountries.get(village.id) || [];
        await Promise.all(
          codes.map(async (code) => {
            const [countryConnected, countryContributed] = await Promise.all([
              getConnectedClassroomsCount(village.id, code, undefined, phase as any),
              getContributedClassroomsCount(village.id, code, undefined, phase as any),
            ]);

            const key = `${village.id}|${code}`;
            connectedVillageCountryMap.set(key, typeof countryConnected === 'number' ? countryConnected : 0);
            contributedVillageCountryMap.set(key, typeof countryContributed === 'number' ? countryContributed : 0);
          }),
        );

        const classCols = villageClassroomsOrdered.get(village.id) || [];
        await Promise.all(
          classCols.map(async (cl) => {
            const [classroomConnected, classroomContributed] = await Promise.all([
              getConnectedClassroomsCount(undefined, undefined, cl.id, phase as any),
              getContributedClassroomsCount(undefined, undefined, cl.id, phase as any),
            ]);
            connectedClassroomMap.set(cl.id, typeof classroomConnected === 'number' && classroomConnected > 0 ? 1 : 0);
            contributedClassroomMap.set(cl.id, typeof classroomContributed === 'number' && classroomContributed > 0 ? 1 : 0);
          }),
        );
      }),
    );

    connectedByPhaseVillage.push(connectedVillageMap);
    contributedByPhaseVillage.push(contributedVillageMap);
    connectedByPhaseVillageCountry.push(connectedVillageCountryMap);
    contributedByPhaseVillageCountry.push(contributedVillageCountryMap);
    connectedByPhaseClassroom.push(connectedClassroomMap);
    contributedByPhaseClassroom.push(contributedClassroomMap);
  }

  return {
    connectedByPhaseVillage,
    contributedByPhaseVillage,
    connectedByPhaseVillageCountry,
    contributedByPhaseVillageCountry,
    connectedByPhaseClassroom,
    contributedByPhaseClassroom,
  };
}

export async function buildRegisteredClassroomsRow(
  villages: VillageInfo[],
  villageCountries: Map<number, string[]>,
  villageClassroomsOrdered: Map<number, ClassroomInfo[]>,
): Promise<(string | number)[]> {
  const registeredLabel = 'Nombre de classes inscrites';
  const registeredRow: (string | number)[] = ['', registeredLabel];

  for (const village of villages) {
    const villageCount = await getRegisteredClassroomsCount(village.id, undefined, undefined);
    registeredRow.push(typeof villageCount === 'number' ? villageCount : 0);
    const codes = villageCountries.get(village.id) || [];

    for (const code of codes) {
      const count = await getRegisteredClassroomsCount(village.id, code, undefined);
      registeredRow.push(typeof count === 'number' ? count : 0);
    }

    const classCols = villageClassroomsOrdered.get(village.id) || [];
    classCols.forEach(() => registeredRow.push(1));
  }

  return registeredRow;
}

export async function buildPhaseRows(
  phases: number[],
  villages: VillageInfo[],
  villageCountries: Map<number, string[]>,
  villageClassroomsOrdered: Map<number, ClassroomInfo[]>,
  byPhaseVillage: Array<Map<number, any>>,
  byPhaseVillageCountry: Array<Map<number, Map<string, any>>>,
  byPhaseVillageClassroom: Array<Map<number, Map<number, any>>>,
  connectionCounts: {
    connectedByPhaseVillage: Array<Map<number, number>>;
    contributedByPhaseVillage: Array<Map<number, number>>;
    connectedByPhaseVillageCountry: Array<Map<string, number>>;
    contributedByPhaseVillageCountry: Array<Map<string, number>>;
    connectedByPhaseClassroom: Array<Map<number, number>>;
    contributedByPhaseClassroom: Array<Map<number, number>>;
  },
): Promise<(string | number)[][]> {
  const rows: (string | number)[][] = [];
  const {
    connectedByPhaseVillage,
    contributedByPhaseVillage,
    connectedByPhaseVillageCountry,
    contributedByPhaseVillageCountry,
    connectedByPhaseClassroom,
    contributedByPhaseClassroom,
  } = connectionCounts;

  for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
    const phase = phases[phaseIndex];
    const activityKeys = ACTIVITY_KEYS_BY_PHASE[phase] || [];

    // Activités par métrique
    for (const metric of activityKeys) {
      const row: (string | number)[] = [phase, METRIC_LABELS[metric] || metric];

      for (const village of villages) {
        const villageDetails = byPhaseVillage[phaseIndex].get(village.id) || {};
        const villageValue = typeof villageDetails[metric] === 'number' ? villageDetails[metric] : 0;
        row.push(villageValue);
        const codes = villageCountries.get(village.id) || [];

        for (const code of codes) {
          const details = byPhaseVillageCountry[phaseIndex].get(village.id)?.get(code) || {};
          const value = typeof details[metric] === 'number' ? details[metric] : 0;
          row.push(value);
        }

        const classCols = villageClassroomsOrdered.get(village.id) || [];

        for (const cl of classCols) {
          const details = byPhaseVillageClassroom[phaseIndex].get(village.id)?.get(cl.id) || {};
          const value = typeof details[metric] === 'number' ? details[metric] : 0;
          row.push(value);
        }
      }

      rows.push(row);
    }

    // Commentaires sous les activités
    {
      const commentRow: (string | number)[] = [phase, METRIC_LABELS['commentCount']];

      for (const village of villages) {
        const villageDetails = byPhaseVillage[phaseIndex].get(village.id) || {};
        const villageValue = typeof villageDetails['commentCount'] === 'number' ? villageDetails['commentCount'] : 0;
        commentRow.push(villageValue);
        const codes = villageCountries.get(village.id) || [];

        for (const code of codes) {
          const details = byPhaseVillageCountry[phaseIndex].get(village.id)?.get(code) || {};
          const value = typeof details['commentCount'] === 'number' ? details['commentCount'] : 0;
          commentRow.push(value);
        }
        const classCols = villageClassroomsOrdered.get(village.id) || [];

        for (const cl of classCols) {
          const details = byPhaseVillageClassroom[phaseIndex].get(village.id)?.get(cl.id) || {};
          const value = typeof details['commentCount'] === 'number' ? details['commentCount'] : 0;
          commentRow.push(value);
        }
      }

      rows.push(commentRow);
    }

    // Nombre de classes connectées
    {
      const connectedLabel = 'Nombre de classes connectées';
      const connectedRow: (string | number)[] = [phase, connectedLabel];

      for (const village of villages) {
        connectedRow.push(connectedByPhaseVillage[phaseIndex].get(village.id) || 0);
        const codes = villageCountries.get(village.id) || [];

        for (const code of codes) {
          const key = `${village.id}|${code}`;
          connectedRow.push(connectedByPhaseVillageCountry[phaseIndex].get(key) || 0);
        }
        const classCols = villageClassroomsOrdered.get(village.id) || [];

        for (const cl of classCols) {
          connectedRow.push(connectedByPhaseClassroom[phaseIndex].get(cl.id) || 0);
        }
      }

      rows.push(connectedRow);
    }

    // Nombre de classes contributrices
    {
      const contributedLabel = 'Nombre de classes contributrices';
      const contributedRow: (string | number)[] = [phase, contributedLabel];

      for (const village of villages) {
        contributedRow.push(contributedByPhaseVillage[phaseIndex].get(village.id) || 0);
        const codes = villageCountries.get(village.id) || [];

        for (const code of codes) {
          const key = `${village.id}|${code}`;
          contributedRow.push(contributedByPhaseVillageCountry[phaseIndex].get(key) || 0);
        }

        const classCols = villageClassroomsOrdered.get(village.id) || [];

        for (const cl of classCols) {
          contributedRow.push(contributedByPhaseClassroom[phaseIndex].get(cl.id) || 0);
        }
      }

      rows.push(contributedRow);
    }

    // Totaux par phase
    {
      const allInteractionsLabel = 'Total des interactions (activités et commentaires)';
      const activitiesNoCommentsLabel = 'Total des activités (hors commentaires)';
      const totalAllRow: (string | number)[] = [phase, allInteractionsLabel];
      const totalNoCommentsRow: (string | number)[] = [phase, activitiesNoCommentsLabel];

      for (const village of villages) {
        const villageDetails = byPhaseVillage[phaseIndex].get(village.id) || {};
        const villageSumActivities = activityKeys.reduce((acc, key) => acc + (typeof villageDetails[key] === 'number' ? villageDetails[key] : 0), 0);
        const villageComment = typeof villageDetails['commentCount'] === 'number' ? villageDetails['commentCount'] : 0;
        const villageVideos = typeof villageDetails['videoCount'] === 'number' ? villageDetails['videoCount'] : 0;
        totalAllRow.push(villageSumActivities + villageComment + villageVideos);
        totalNoCommentsRow.push(villageSumActivities + villageVideos);

        const codes = villageCountries.get(village.id) || [];

        for (const code of codes) {
          const details = byPhaseVillageCountry[phaseIndex].get(village.id)?.get(code) || {};
          const sumActivities = activityKeys.reduce((acc, key) => acc + (typeof details[key] === 'number' ? details[key] : 0), 0);
          const comment = typeof details['commentCount'] === 'number' ? details['commentCount'] : 0;
          const videos = typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
          totalAllRow.push(sumActivities + comment + videos);
          totalNoCommentsRow.push(sumActivities + videos);
        }

        const classCols = villageClassroomsOrdered.get(village.id) || [];

        for (const cl of classCols) {
          const details = byPhaseVillageClassroom[phaseIndex].get(village.id)?.get(cl.id) || {};
          const sumActivities = activityKeys.reduce((acc, key) => acc + (typeof details[key] === 'number' ? details[key] : 0), 0);
          const comment = typeof details['commentCount'] === 'number' ? details['commentCount'] : 0;
          const videos = typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
          totalAllRow.push(sumActivities + comment + videos);
          totalNoCommentsRow.push(sumActivities + videos);
        }
      }

      rows.push(totalAllRow);
      rows.push(totalNoCommentsRow);
    }

    // Total vidéos produites
    {
      const videoRow: (string | number)[] = [phase, METRIC_LABELS['videoCount']];

      for (const village of villages) {
        const villageDetails = byPhaseVillage[phaseIndex].get(village.id) || {};
        const villageValue = typeof villageDetails['videoCount'] === 'number' ? villageDetails['videoCount'] : 0;
        videoRow.push(villageValue);
        const codes = villageCountries.get(village.id) || [];

        for (const code of codes) {
          const details = byPhaseVillageCountry[phaseIndex].get(village.id)?.get(code) || {};
          const value = typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
          videoRow.push(value);
        }

        const classCols = villageClassroomsOrdered.get(village.id) || [];

        for (const cl of classCols) {
          const details = byPhaseVillageClassroom[phaseIndex].get(village.id)?.get(cl.id) || {};
          const value = typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
          videoRow.push(value);
        }
      }

      rows.push(videoRow);
    }
  }

  return rows;
}

export async function buildAllPhasesRows(
  phases: number[],
  villages: VillageInfo[],
  villageCountries: Map<number, string[]>,
  villageClassroomsOrdered: Map<number, ClassroomInfo[]>,
  byPhaseVillage: Array<Map<number, any>>,
  byPhaseVillageCountry: Array<Map<number, Map<string, any>>>,
  byPhaseVillageClassroom: Array<Map<number, Map<number, any>>>,
  connectionCounts: {
    connectedByPhaseVillage: Array<Map<number, number>>;
    contributedByPhaseVillage: Array<Map<number, number>>;
    connectedByPhaseVillageCountry: Array<Map<string, number>>;
    contributedByPhaseVillageCountry: Array<Map<string, number>>;
    connectedByPhaseClassroom: Array<Map<number, number>>;
    contributedByPhaseClassroom: Array<Map<number, number>>;
  },
): Promise<(string | number)[][]> {
  const rows: (string | number)[][] = [];

  const { connectedByPhaseClassroom, contributedByPhaseClassroom } = connectionCounts;

  // Helper: union of all activity keys across phases
  const allActivityKeys: string[] = Array.from(new Set((Object.values(ACTIVITY_KEYS_BY_PHASE) as string[][]).flat()));

  // 1) Nombre de classes connectées au moins une fois à chaque phase (intersection des phases)
  {
    const label = 'Nombre de classes connectées au moins une fois à chaque phase';
    const row: (string | number)[] = ['', label];

    for (const village of villages) {
      const classCols = villageClassroomsOrdered.get(village.id) || [];
      const villageCount = classCols.reduce((acc, cl) => {
        const inAllPhases = phases.every((_, idx) => (connectedByPhaseClassroom[idx].get(cl.id) || 0) > 0);
        return acc + (inAllPhases ? 1 : 0);
      }, 0);
      row.push(villageCount);

      const codes = villageCountries.get(village.id) || [];
      for (const code of codes) {
        const countryCount = classCols.reduce((acc, cl) => {
          if (cl.countryCode !== code) return acc;
          const inAllPhases = phases.every((_, idx) => (connectedByPhaseClassroom[idx].get(cl.id) || 0) > 0);
          return acc + (inAllPhases ? 1 : 0);
        }, 0);
        row.push(countryCount);
      }

      for (const cl of classCols) {
        const inAllPhases = phases.every((_, idx) => (connectedByPhaseClassroom[idx].get(cl.id) || 0) > 0);
        row.push(inAllPhases ? 1 : 0);
      }
    }

    rows.push(row);
  }

  // 2) Nombre de classes contributrices à chaque phase (intersection des phases)
  {
    const label = 'Nombre de classes contributrices à chaque phase';
    const row: (string | number)[] = ['', label];

    for (const village of villages) {
      const classCols = villageClassroomsOrdered.get(village.id) || [];
      const villageCount = classCols.reduce((acc, cl) => {
        const inAllPhases = phases.every((_, idx) => (contributedByPhaseClassroom[idx].get(cl.id) || 0) > 0);
        return acc + (inAllPhases ? 1 : 0);
      }, 0);
      row.push(villageCount);

      const codes = villageCountries.get(village.id) || [];
      for (const code of codes) {
        const countryCount = classCols.reduce((acc, cl) => {
          if (cl.countryCode !== code) return acc;
          const inAllPhases = phases.every((_, idx) => (contributedByPhaseClassroom[idx].get(cl.id) || 0) > 0);
          return acc + (inAllPhases ? 1 : 0);
        }, 0);
        row.push(countryCount);
      }

      for (const cl of classCols) {
        const inAllPhases = phases.every((_, idx) => (contributedByPhaseClassroom[idx].get(cl.id) || 0) > 0);
        row.push(inAllPhases ? 1 : 0);
      }
    }

    rows.push(row);
  }

  // 3) Total des intéractions (activités et commentaires) — toutes phases confondues
  // 4) Total activités (hors commentaires) — toutes phases confondues
  {
    const totalInteractionsLabel = 'Total des interactions (activités et commentaires)';
    const totalActivitiesNoCommentsLabel = 'Total des activités (hors commentaires)';

    const totalAllRow: (string | number)[] = ['', totalInteractionsLabel];
    const totalNoCommentsRow: (string | number)[] = ['', totalActivitiesNoCommentsLabel];

    for (const village of villages) {
      // Village-level totals
      let villageActivitiesSum = 0;
      let villageCommentsSum = 0;
      let villageVideosSum = 0;

      for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
        const villageDetails = byPhaseVillage[phaseIndex].get(village.id) || {};
        villageActivitiesSum += allActivityKeys.reduce((acc, key) => acc + (typeof villageDetails[key] === 'number' ? villageDetails[key] : 0), 0);
        villageCommentsSum += typeof villageDetails['commentCount'] === 'number' ? villageDetails['commentCount'] : 0;
        villageVideosSum += typeof villageDetails['videoCount'] === 'number' ? villageDetails['videoCount'] : 0;
      }
      totalAllRow.push(villageActivitiesSum + villageCommentsSum + villageVideosSum);
      totalNoCommentsRow.push(villageActivitiesSum + villageVideosSum);

      // Country-level totals within village
      const codes = villageCountries.get(village.id) || [];
      for (const code of codes) {
        let countryActivitiesSum = 0;
        let countryCommentsSum = 0;
        let countryVideosSum = 0;
        for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
          const details = byPhaseVillageCountry[phaseIndex].get(village.id)?.get(code) || {};
          countryActivitiesSum += allActivityKeys.reduce((acc, key) => acc + (typeof details[key] === 'number' ? details[key] : 0), 0);
          countryCommentsSum += typeof details['commentCount'] === 'number' ? details['commentCount'] : 0;
          countryVideosSum += typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
        }
        totalAllRow.push(countryActivitiesSum + countryCommentsSum + countryVideosSum);
        totalNoCommentsRow.push(countryActivitiesSum + countryVideosSum);
      }

      // Classroom-level totals
      const classCols = villageClassroomsOrdered.get(village.id) || [];
      for (const cl of classCols) {
        let classActivitiesSum = 0;
        let classCommentsSum = 0;
        let classVideosSum = 0;
        for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
          const details = byPhaseVillageClassroom[phaseIndex].get(village.id)?.get(cl.id) || {};
          classActivitiesSum += allActivityKeys.reduce((acc, key) => acc + (typeof details[key] === 'number' ? details[key] : 0), 0);
          classCommentsSum += typeof details['commentCount'] === 'number' ? details['commentCount'] : 0;
          classVideosSum += typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
        }
        totalAllRow.push(classActivitiesSum + classCommentsSum + classVideosSum);
        totalNoCommentsRow.push(classActivitiesSum + classVideosSum);
      }
    }

    rows.push(totalAllRow);
    rows.push(totalNoCommentsRow);
  }

  // 5) Total vidéos produites — toutes phases confondues
  {
    const label = METRIC_LABELS['videoCount'];
    const row: (string | number)[] = ['', label];

    for (const village of villages) {
      let villageVideosSum = 0;
      for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
        const villageDetails = byPhaseVillage[phaseIndex].get(village.id) || {};
        villageVideosSum += typeof villageDetails['videoCount'] === 'number' ? villageDetails['videoCount'] : 0;
      }
      row.push(villageVideosSum);

      const codes = villageCountries.get(village.id) || [];
      for (const code of codes) {
        let countryVideosSum = 0;
        for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
          const details = byPhaseVillageCountry[phaseIndex].get(village.id)?.get(code) || {};
          countryVideosSum += typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
        }
        row.push(countryVideosSum);
      }

      const classCols = villageClassroomsOrdered.get(village.id) || [];
      for (const cl of classCols) {
        let classVideosSum = 0;
        for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
          const details = byPhaseVillageClassroom[phaseIndex].get(village.id)?.get(cl.id) || {};
          classVideosSum += typeof details['videoCount'] === 'number' ? details['videoCount'] : 0;
        }
        row.push(classVideosSum);
      }
    }

    rows.push(row);
  }

  return rows;
}
