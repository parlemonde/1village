import { EngagementStatus, EngagementStatusColor } from 'types/statistics.type';

const entityStatusColor: Record<EngagementStatus, EngagementStatusColor> = {
  [EngagementStatus.ACTIVE]: EngagementStatusColor.ACTIVE,
  [EngagementStatus.GHOST]: EngagementStatusColor.GHOST,
  [EngagementStatus.OBSERVER]: EngagementStatusColor.OBSERVER,
};

export function getCountryColor(status?: EngagementStatus): EngagementStatusColor {
  return status !== undefined ? entityStatusColor[status] : EngagementStatusColor.DEAULT;
}
