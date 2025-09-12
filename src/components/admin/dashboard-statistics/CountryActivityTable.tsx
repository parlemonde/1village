import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { CountryActivityTableHeaders, getCountryActivityTableHeaders } from './utils/tableHeaders';
import type { EntityActivityCounts, PhaseTableRow } from 'src/api/statistics/compare.api';
import { useCountryActivityTable } from 'src/services/useCountryActivityTable';

export type CountryActivityMode = 'country' | 'class';

const CountryActivityTable: React.FC<{ countryCode: string; phaseId: number; mode?: CountryActivityMode }> = (props) => {
  const { countryCode, phaseId, mode = 'class' } = props;
  const data = useCountryActivityTable(countryCode, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  // On adapte les données pour le tableau (plat, phaseDetail à la racine)
  const tableData: PhaseTableRow[] =
    mode === 'country'
      ? data.map((row: EntityActivityCounts, idx: number) => ({
          ...row,
          id: row.id || idx,
        }))
      : data.map((row: EntityActivityCounts, idx: number) => ({
          ...row,
          id: row.id || idx,
          contentLibreCount: undefined,
        }));

  const columns = mode === 'country' ? getCountryActivityTableHeaders(phaseId) : CountryActivityTableHeaders;

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
        data={tableData}
        columns={columns}
        rowStyle={rowStyle}
        tableLayout="auto"
      />
    </div>
  );
};

export default CountryActivityTable;
