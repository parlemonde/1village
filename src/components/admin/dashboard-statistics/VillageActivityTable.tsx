import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { getCountryActivityTableHeaders } from './utils/tableHeaders';
import { useVillageActivityTable } from 'src/services/useVillageActivityTable';

interface VillageActivityTableProps {
  villageId: number;
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

const VillageActivityTable: React.FC<VillageActivityTableProps> = (props: VillageActivityTableProps) => {
  const { villageId, phaseId } = props;
  const data = useVillageActivityTable(villageId, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  const columns = getCountryActivityTableHeaders(phaseId);
  const rowStyle = (row: TableRow) => {
    if (row.id === 'total') {
      return { color: 'black', fontWeight: 'bold', borderBottom: '2px solid black' };
    }
    return {};
  };

  return (
    <div style={{ margin: '0rem 0', overflowX: 'auto', width: '100%' }}>
      <OneVillageTable
        admin={false}
        emptyPlaceholder={<p>Aucune donnée pour ce village</p>}
        data={data}
        columns={columns}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default VillageActivityTable;
