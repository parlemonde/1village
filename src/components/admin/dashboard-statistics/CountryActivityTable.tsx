import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { CountryActivityTableHeaders, getCountryActivityTableHeaders } from './utils/tableHeaders';
import { useCountryActivityTable, type CountryRow } from 'src/services/useCountryActivityTable';

export type CountryActivityMode = 'country' | 'class';

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

const CountryActivityTable: React.FC<{ countryCode: string; phaseId: number; mode?: CountryActivityMode }> = (props) => {
  const { countryCode, phaseId, mode = 'class' } = props;
  const data = useCountryActivityTable(countryCode, phaseId);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  // On adapte les données pour le tableau (plat, phaseDetail à la racine)
  const tableData: TableRow[] =
    mode === 'country'
      ? data.map((row: CountryRow, idx: number) => ({
          ...row,
          id: row.id || idx,
          _highlight: row.isSelected,
        }))
      : data.map((row: CountryRow, idx: number) => ({
          id: row.id || idx,
          name: row.name,
          totalPublications: row.totalPublications,
          commentCount: row.commentCount,
          draftCount: row.draftCount,
          mascotCount: row.mascotCount,
          videoCount: row.videoCount,
          challengeCount: row.challengeCount,
          enigmaCount: row.enigmaCount,
          gameCount: row.gameCount,
          questionCount: row.questionCount,
          reactionCount: row.reactionCount,
          reportingCount: row.reportingCount,
          storyCount: row.storyCount,
          anthemCount: row.anthemCount,
          reinventStoryCount: row.reinventStoryCount,
          _highlight: row.isSelected,
        }));

  const columns = mode === 'country' ? getCountryActivityTableHeaders(phaseId) : CountryActivityTableHeaders;

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
