import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { getClassroomActivityTableHeaders } from './utils/tableHeaders';
import { useClassroomActivityTable } from 'src/services/useClassroomActivityTable';

interface ClassroomActivityTableProps {
  classroomId: number;
  phaseId: number;
}

type TableRow = {
  id: string | number;
  name: string;
  totalPublications?: number;
  commentCount?: number;
  draftCount?: number;
  mascotCount?: number;
  videoCount?: number;
  challengeCount?: number;
  enigmaCount?: number;
  gameCount?: number;
  questionCount?: number;
  reactionCount?: number;
  reportingCount?: number;
  storyCount?: number;
  anthemCount?: number;
  reinventStoryCount?: number;
  isSelected?: boolean;
  _highlight?: boolean;
};

const ClassroomActivityTable: React.FC<ClassroomActivityTableProps> = (props: ClassroomActivityTableProps) => {
  const { classroomId, phaseId } = props;
  const data = useClassroomActivityTable(classroomId, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  // On adapte les données pour le tableau
  const tableData: TableRow[] = data.map(
    (row: { id?: string | number; name?: string; isSelected?: boolean; [key: string]: unknown }, idx: number) => ({
      ...row,
      id: row.id || idx,
      name: row.name || `Row ${idx}`,
      _highlight: row.isSelected,
    }),
  );

  const columns = getClassroomActivityTableHeaders(phaseId);

  // Custom row style: bleu si _highlight
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
        data={tableData}
        columns={columns}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default ClassroomActivityTable;
