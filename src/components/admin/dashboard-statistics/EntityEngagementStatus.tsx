import CircleIcon from '@mui/icons-material/Circle';
import { Box } from '@mui/material';

import { getCountryColor } from './utils/colorMapper';
import type { EngagementStatusColor } from 'types/statistics.type';
import { EngagementStatus } from 'types/statistics.type';

const entityStatusLabel: Record<EngagementStatus, (entityType: EntityType) => EngagementStatusLabel> = {
  [EngagementStatus.ACTIVE]: (entityType) => (entityType === EntityType.CLASSROOM ? EngagementStatusLabel.ACTIVE : EngagementStatusLabel.ACTIF),
  [EngagementStatus.GHOST]: () => EngagementStatusLabel.FANTOME,
  [EngagementStatus.OBSERVER]: (entityType) =>
    entityType === EntityType.CLASSROOM ? EngagementStatusLabel.OBSERVATRICE : EngagementStatusLabel.OBSERVATEUR,
};

export enum EntityType {
  CLASSROOM = 'Classroom',
  COUNTRY = 'Country',
  VILLAGE = 'Village',
}

enum EngagementStatusLabel {
  ACTIF = 'Actif',
  ACTIVE = 'Active',
  FANTOME = 'Fantôme',
  OBSERVATEUR = 'Observateur',
  OBSERVATRICE = 'Observatrice',
}

interface EntityEngagementStatusData {
  color: EngagementStatusColor;
  label: EngagementStatusLabel;
}

interface EntityEngagementStatusProps {
  entityType: EntityType;
  entityEngagementStatus: EngagementStatus;
}

const EntityEngagementStatus = ({ entityType, entityEngagementStatus }: EntityEngagementStatusProps) => {
  const engagementStatusData: EntityEngagementStatusData = getEngagementStatusData(entityEngagementStatus, entityType);

  return (
    <Box sx={{ display: 'flex' }}>
      <p style={{ fontWeight: 600, marginLeft: '.75rem', marginRight: '.25rem' }}>Statut : {engagementStatusData.label}</p>
      <CircleIcon sx={{ color: engagementStatusData.color, verticalAlign: 'middle', height: '.90rem', margin: 'auto 0' }} />
    </Box>
  );
};

export default EntityEngagementStatus;

function getEngagementStatusData(engagementStatus: EngagementStatus, entityType: EntityType): EntityEngagementStatusData {
  return {
    color: getCountryColor(engagementStatus),
    label: entityStatusLabel[engagementStatus](entityType),
  };
}
