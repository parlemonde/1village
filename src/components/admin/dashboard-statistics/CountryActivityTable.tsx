import React from 'react';

import { OneVillageTable } from '../OneVillageTable';
import { CountryActivityTableHeaders, getCountryActivityTableHeaders } from './utils/tableHeaders';
import { useCountryActivityTable } from 'src/services/useCountryActivityTable';
import type { ClassroomActivity, PhaseDetail, CountryActivityMode } from 'src/services/useCountryActivityTable';

interface CountryActivityTableProps {
  countryCode: string;
  phaseId: number;
  mode?: CountryActivityMode;
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

const CountryActivityTable: React.FC<CountryActivityTableProps> = (props: CountryActivityTableProps) => {
  const { countryCode, phaseId, mode = 'class' } = props;
  const data = useCountryActivityTable(countryCode, phaseId, mode);

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible pour cette phase.</div>;
  }

  // On adapte les données pour le tableau (plat, phaseDetail à la racine)
  const tableData: TableRow[] =
    mode === 'country'
      ? data.map((row: any, idx: number) => ({
        ...row,
        id: row.id || idx,
        _highlight: row.isSelected,
      }))
      : (data as (ClassroomActivity & { phaseDetail?: PhaseDetail })[]).map((row, idx: number) => ({
        id: row.classroomId || idx,
        name: row.name,
        totalPublications: row.totalPublications,
        ...row.phaseDetail,
        _highlight: true,
      }));

  const columns = mode === 'country' ? getCountryActivityTableHeaders(phaseId) : CountryActivityTableHeaders;

  // Custom row style: bleu si _highlight
  const rowStyle = (row: TableRow) => (row._highlight ? { color: '#1976d2', fontWeight: 600 } : {});

  return (
    <div style={{ margin: '0rem 0', overflowX: 'auto' }}>
      <OneVillageTable admin={false} emptyPlaceholder={<p>Aucune donnée pour ce pays</p>} data={tableData} columns={columns} rowStyle={rowStyle} />
    </div>
  );
};

export default CountryActivityTable;
