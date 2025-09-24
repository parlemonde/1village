import type { FC } from 'react';
import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { getCountryActivityTableHeaders } from './utils/tableHeaders';
import type { PhaseTableRow } from 'src/api/statistics/compare.api';
import { useCountryActivityTable } from 'src/services/useCountryActivityTable';

export type CountryActivityMode = 'country' | 'class';

interface ClassroomActivityTableProps {
  countryCode: string;
  phaseId: number;
}

const CountryActivityTable: FC<ClassroomActivityTableProps> = (props: ClassroomActivityTableProps) => {
  const { countryCode, phaseId } = props;
  const data = useCountryActivityTable(countryCode, phaseId);

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
        emptyPlaceholder={<p>Aucune donnée pour ce pays</p>}
        data={data}
        columns={getCountryActivityTableHeaders(phaseId)}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default CountryActivityTable;
