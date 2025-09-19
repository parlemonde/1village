import type { FC } from 'react';

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { OneVillageTable } from '../OneVillageTable';
import { getVillageActivityTableHeaders } from './utils/tableHeaders';
import { useOneVillageActivityTable } from 'src/services/useOneVillageActivityTable';

interface PhaseTableRow {
  id: string | number;
  villageName: string;
  [key: string]: string | number;
}

interface OneVillagePhaseAccordionProps {
  phaseId: number;
  open: boolean;
  onClick: () => void;
}

const OneVillagePhaseAccordion: FC<OneVillagePhaseAccordionProps> = ({ phaseId, open, onClick }) => {
  const villagesPhaseActivityCounts = useOneVillageActivityTable(phaseId);

  const rowStyle = (row: PhaseTableRow) => {
    if (row.name === 'Total') {
      return { color: 'black', fontWeight: 'bold', borderBottom: '2px solid black' };
    }
    return {};
  };

  return (
    <div style={{ marginTop: '1.5rem', borderRadius: 8, border: '1px solid #eee', background: '#fafbfc' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '1rem',
          fontWeight: 600,
          fontSize: 18,
          borderBottom: open ? '1px solid #eee' : 'none',
        }}
        onClick={onClick}
      >
        <span>Phase {phaseId}</span>
        {open ? <KeyboardDoubleArrowUpIcon fontSize="large" /> : <KeyboardDoubleArrowDownIcon fontSize="large" />}
      </div>
      {open && (
        <div style={{ padding: '1rem' }}>
          <OneVillageTable
            admin={false}
            emptyPlaceholder={<p>Aucune donnée disponible pour la phase {phaseId}</p>}
            data={villagesPhaseActivityCounts}
            columns={getVillageActivityTableHeaders(phaseId)}
            rowStyle={rowStyle}
            tableLayout="auto"
          />
        </div>
      )}
    </div>
  );
};

export default OneVillagePhaseAccordion;
