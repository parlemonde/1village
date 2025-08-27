import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { getClassroomActivityTableHeaders } from './utils/tableHeaders';
import type { PhaseTableRow } from 'src/api/statistics/compare.api';
import { useClassroomActivityTable } from 'src/services/useClassroomActivityTable';

interface ClassroomActivityTableProps {
  villageId: number;
  classroomId: number;
  phaseId: number;
}

const ClassroomActivityTable: React.FC<ClassroomActivityTableProps> = (props: ClassroomActivityTableProps) => {
  const { villageId, classroomId, phaseId } = props;
  const data = useClassroomActivityTable(villageId, classroomId, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  // Custom row style: bleu si isSelected
  const rowStyle = (row: PhaseTableRow) => {
    if (row.id === 'total') {
      return { color: 'black', fontWeight: 'bold', borderBottom: '2px solid black' };
    }
    if (row.isSelected) {
      return { color: 'blue', fontWeight: 'bold' };
    }
    return {};
  };

  return (
    <div style={{ margin: '0rem 0', overflowX: 'auto', width: '100%' }}>
      <OneVillageTable
        admin={false}
        emptyPlaceholder={<p>Aucune donnée pour cette classe</p>}
        data={data}
        columns={getClassroomActivityTableHeaders(phaseId)}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default ClassroomActivityTable;
