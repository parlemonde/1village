import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { getCountryActivityTableHeaders } from './utils/tableHeaders';
import type { PhaseTableRow } from 'src/api/statistics/compare.api';
import { useVillageActivityTable } from 'src/services/useVillageActivityTable';

interface VillageActivityTableProps {
  villageId: number;
  phaseId: number;
}

const VillageActivityTable: React.FC<VillageActivityTableProps> = (props: VillageActivityTableProps) => {
  const { villageId, phaseId } = props;
  const data = useVillageActivityTable(villageId, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  // On adapte les données pour le tableau
  const tableData: PhaseTableRow[] = data.map(
    (row: { id?: string | number; name?: string; isSelected?: boolean; [key: string]: unknown }, idx: number) => ({
      ...row,
      id: row.id || idx,
      name: row.name || `Row ${idx}`,
    }),
  );

  const columns = getCountryActivityTableHeaders(phaseId);

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
        emptyPlaceholder={<p>Aucune donnée pour ce village</p>}
        data={tableData}
        columns={columns}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default VillageActivityTable;
