import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { getClassroomActivityTableHeaders } from './utils/tableHeaders';
import { useClassroomActivityTable } from 'src/services/useClassroomActivityTable';

interface ClassroomActivityTableProps {
  villageId: number;
  classroomId: string;
  phaseId: number;
}

type TableRow = {
  id: string | number;
  isSelected?: boolean;
};

const ClassroomActivityTable: React.FC<ClassroomActivityTableProps> = (props: ClassroomActivityTableProps) => {
  const { villageId, classroomId, phaseId } = props;
  const data = useClassroomActivityTable(villageId, classroomId, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  const columns = getClassroomActivityTableHeaders(phaseId);

  const rowStyle = (row: TableRow) => {
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
        columns={columns}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default ClassroomActivityTable;
