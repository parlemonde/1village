import React from 'react';

import { OneVillageTable } from '../../OneVillageTable';
import { getClassroomsToMonitorRows } from '../../StatisticsUtils';
import { useGetClassroomsToMonitorStats } from 'src/api/statistics/statistics.get';

const ClassroomsToMonitorHeaders = [
  { key: 'name', label: 'Classe', sortable: true },
  { key: 'vm', label: 'Village-Monde', sortable: true },
  { key: 'teacher', label: 'Professeur', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
];

interface ClassroomsToMonitorTableProps {
  villageId?: number;
  countryId?: string;
}

const ClassroomsToMonitorTable: React.FC<ClassroomsToMonitorTableProps> = (props: ClassroomsToMonitorTableProps) => {
  const { villageId, countryId } = props;

  const { data } = useGetClassroomsToMonitorStats(countryId, villageId);

  const classroomsToMonitorRows = getClassroomsToMonitorRows(data);

  if (!classroomsToMonitorRows || classroomsToMonitorRows.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }
  return (
    <OneVillageTable
      admin={false}
      emptyPlaceholder={<p>{'Pas de données'}</p>}
      data={classroomsToMonitorRows}
      columns={ClassroomsToMonitorHeaders}
      titleContent={`À surveiller (${classroomsToMonitorRows.length})`}
    />
  );
};

export default ClassroomsToMonitorTable;
