import React from 'react';

import { OneVillageTable } from '../../OneVillageTable';
import { getClassroomToSurveilRows } from '../../StatisticsUtils';
import { useGetClassroomsToMonitorStats } from 'src/api/statistics/statistics.get';

const ClassroomToSurveilHeaders = [
  { key: 'name', label: 'Classe', sortable: true },
  { key: 'vm', label: 'Village-Monde', sortable: true },
  { key: 'teacher', label: 'Professeur', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
];

interface ClassroomsToMonitorTableProps {
  villageId?: number;
  countryId?: string;
  phaseId?: number;
}

const ClassroomsToMonitorTable: React.FC<ClassroomsToMonitorTableProps> = (props: ClassroomsToMonitorTableProps) => {
  const { villageId, phaseId, countryId } = props;

  const { data } = useGetClassroomsToMonitorStats(countryId, villageId, phaseId);

  const classroomToSurveilRows = getClassroomToSurveilRows(data);

  if (!classroomToSurveilRows || classroomToSurveilRows.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }
  return (
    <OneVillageTable
      admin={false}
      emptyPlaceholder={<p>{'Pas de données'}</p>}
      data={classroomToSurveilRows}
      columns={ClassroomToSurveilHeaders}
      titleContent={`À surveiller (${classroomToSurveilRows.length})`}
    />
  );
};

export default ClassroomsToMonitorTable;
