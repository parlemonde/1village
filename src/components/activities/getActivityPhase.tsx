import { ActivityType } from 'types/activity.type';
import { PhaseType } from 'types/phase.type';

const specificActivityPhase = {
  [ActivityType.MASCOTTE]: [PhaseType.ONE, PhaseType.TWO, PhaseType.THREE],
  [ActivityType.PRESENTATION]: [PhaseType.ONE, PhaseType.TWO, PhaseType.THREE],
  [ActivityType.DEFI]: [PhaseType.TWO],
  [ActivityType.GAME]: [PhaseType.TWO],
  [ActivityType.ENIGME]: [PhaseType.TWO],
  [ActivityType.QUESTION]: [PhaseType.ONE, PhaseType.TWO, PhaseType.THREE],
  [ActivityType.CONTENU_LIBRE]: [PhaseType.ONE, PhaseType.TWO, PhaseType.THREE],
  [ActivityType.INDICE]: [PhaseType.ONE],
  [ActivityType.SYMBOL]: [PhaseType.ONE],
  [ActivityType.REPORTAGE]: [PhaseType.TWO],
  [ActivityType.REACTION]: [PhaseType.TWO],
  [ActivityType.STORY]: [PhaseType.THREE],
  [ActivityType.RE_INVENT_STORY]: [PhaseType.THREE],
  [ActivityType.ANTHEM]: [],
  [ActivityType.VERSE_RECORD]: [PhaseType.THREE],
};
export const getActivityPhase = (activityType: number, activePhase: number, selectedPhase: number) => {
  const availablePhases = specificActivityPhase[activityType] || [PhaseType.ONE, PhaseType.TWO, PhaseType.THREE];
  //Anthem case
  if (availablePhases.length === 0) {
    return activePhase;
  }
  //Other cases : verified if selectedPhase is include in ActivityPhase
  if (availablePhases.includes(selectedPhase) && selectedPhase <= activePhase) {
    return selectedPhase;
  }
  //default value in any other case : old logic keeped here
  return availablePhases
    .filter((p) => p <= activePhase)
    .concat([1])
    .sort((a, b) => b - a)[0];
};
//
