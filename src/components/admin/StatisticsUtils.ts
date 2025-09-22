import type { ClassroomToMonitor, OneVillageTableRow } from '../../../types/statistics.type';
import { ClassroomMonitoringStatus } from '../../../types/statistics.type';
import { getUserDisplayName } from 'src/utils';

export const getStatusLabel = (status: ClassroomMonitoringStatus): string => {
  return (
    new Map<ClassroomMonitoringStatus, string>([
      [ClassroomMonitoringStatus.NO_CONNECTION_SINCE_FIRST, '1 seule connexion'],
      [ClassroomMonitoringStatus.AT_LEAST_THREE_DRAFTS_IN_PROGRESS, 'accumulation de brouillons '],
      [ClassroomMonitoringStatus.THREE_WEEK_WITHOUT_CONNECTION, 'Au moins 3 semaines sans connexion'],
    ]).get(status) ?? 'Statut inconnu'
  );
};

export const getClassroomsToMonitorRows = (data: ClassroomToMonitor[] | undefined): OneVillageTableRow[] => {
  if (!data || !Array.isArray(data)) return [];
  return data.map(
    (classroom) =>
      ({
        ...classroom,
        name: classroom.name ?? getUserDisplayName(classroom.user, false, true),
        status: getStatusLabel(classroom.status),
      } as unknown as OneVillageTableRow),
  );
};
