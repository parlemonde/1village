import React from 'react';

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { OneVillageTable } from '../OneVillageTable';

interface PhaseTableRow {
    id: string | number;
    villageName: string;
    [key: string]: string | number;
}

interface Props {
    phaseId: number;
    data: PhaseTableRow[];
    columns: Array<{ key: string; label: string; sortable?: boolean }>;
    rowStyle: (row: PhaseTableRow) => React.CSSProperties;
    open: boolean;
    onClick: () => void;
}

const phaseLabels: Record<number, string> = {
    1: 'Phase 1',
    2: 'Phase 2',
    3: 'Phase 3',
};

const OneVillagePhaseAccordion: React.FC<Props> = ({ phaseId, data, columns, rowStyle, open, onClick }) => {
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
                <div style={{ padding: '1rem' }}>
                    <OneVillageTable
                        admin={false}
                        emptyPlaceholder={<p>Aucune donnée disponible pour la {phaseLabels[phaseId]}</p>}
                        data={data}
                        columns={columns}
                        rowStyle={rowStyle}
                        tableLayout="auto"
                    />
                </div>
            )}
        </div>
    );
};

export default OneVillagePhaseAccordion;
