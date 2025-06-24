import React from 'react';

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import CountryActivityTable from './CountryActivityTable';

interface Props {
  phaseId: number;
  countryCode: string;
  open: boolean;
  onClick: () => void;
}

const phaseLabels: Record<number, string> = {
  1: 'Phase 1',
  2: 'Phase 2',
  3: 'Phase 3',
};

const CountryActivityPhaseAccordion: React.FC<Props> = ({ phaseId, countryCode, open, onClick }) => {
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
        <span>{phaseLabels[phaseId]}</span>
        {open ? <KeyboardDoubleArrowUpIcon fontSize="large" /> : <KeyboardDoubleArrowDownIcon fontSize="large" />}
      </div>
      {open && (
        <div style={{ width: '100vh', padding: '1rem' }}>
          <CountryActivityTable countryCode={countryCode} phaseId={phaseId} mode="country" />
        </div>
      )}
    </div>
  );
};

export default CountryActivityPhaseAccordion;
