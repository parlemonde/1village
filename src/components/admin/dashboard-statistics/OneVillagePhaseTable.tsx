import React, { useMemo } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { getPhaseTableHeaders } from './utils/tableHeaders';
import type { PhaseData } from 'src/api/statistics/compare.api';
import type { VillageStats } from 'types/statistics.type';

interface OneVillagePhaseTableProps {
  data?: VillageStats;
}

interface VillageRowData {
  villageName: string;
  phase1: PhaseData;
  phase2: PhaseData;
  phase3: PhaseData;
}

const createEmptyPhaseData = (phaseId: number): PhaseData => ({
  phaseId,
  indiceCount: 0,
  mascotCount: 0,
  videoCount: 0,
  draftCount: 0,
  commentCount: 0,
  challengeCount: 0,
  enigmaCount: 0,
  gameCount: 0,
  questionCount: 0,
  reactionCount: 0,
  reportingCount: 0,
  storyCount: 0,
  anthemCount: 0,
  contentLibreCount: 0,
  reinventStoryCount: 0,
});

const aggregatePhaseData = (targetPhase: PhaseData, phase: any) => {
  targetPhase.indiceCount += phase.indiceCount || 0;
  targetPhase.mascotCount += phase.mascotCount || 0;
  targetPhase.videoCount += phase.videoCount || 0;
  targetPhase.draftCount += phase.draftCount || 0;
  targetPhase.commentCount += phase.commentCount || 0;
  targetPhase.challengeCount += phase.challengeCount || 0;
  targetPhase.enigmaCount += phase.enigmaCount || 0;
  targetPhase.gameCount += phase.gameCount || 0;
  targetPhase.questionCount += phase.questionCount || 0;
  targetPhase.reactionCount += phase.reactionCount || 0;
  targetPhase.reportingCount += phase.reportingCount || 0;
  targetPhase.storyCount += phase.storyCount || 0;
  targetPhase.anthemCount += phase.anthemCount || 0;
  targetPhase.contentLibreCount += phase.contentLibreCount || 0;
  targetPhase.reinventStoryCount += phase.reinventStoryCount || 0;
};

const getTargetPhase = (villageRow: VillageRowData, phaseId: number): PhaseData | null => {
  switch (phaseId) {
    case 1:
      return villageRow.phase1;
    case 2:
      return villageRow.phase2;
    case 3:
      return villageRow.phase3;
    default:
      return null;
  }
};

const OneVillagePhaseTable: React.FC<OneVillagePhaseTableProps> = ({ data }: { data?: VillageStats }) => {
  const [expandedPhases, setExpandedPhases] = React.useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const villageData = useMemo(() => {
    if (!data?.activityCountDetails) return [];

    const villages: VillageRowData[] = [];

    data.activityCountDetails.forEach((villageDetail: any) => {
      const villageRow: VillageRowData = {
        villageName: villageDetail.villageName,
        phase1: createEmptyPhaseData(1),
        phase2: createEmptyPhaseData(2),
        phase3: createEmptyPhaseData(3),
      };

      villageDetail.classrooms.forEach((classroom: any) => {
        classroom.phaseDetails.forEach((phase: any) => {
          const targetPhase = getTargetPhase(villageRow, phase.phaseId);
          if (targetPhase) {
            aggregatePhaseData(targetPhase, phase);
          }
        });
      });

      villages.push(villageRow);
    });

    return villages;
  }, [data]);

  const totalData = useMemo(() => {
    if (villageData.length === 0) return null;

    const total: VillageRowData = {
      villageName: 'Total',
      phase1: createEmptyPhaseData(1),
      phase2: createEmptyPhaseData(2),
      phase3: createEmptyPhaseData(3),
    };

    villageData.forEach((village: VillageRowData) => {
      aggregatePhaseData(total.phase1, village.phase1);
      aggregatePhaseData(total.phase2, village.phase2);
      aggregatePhaseData(total.phase3, village.phase3);
    });

    return total;
  }, [villageData]);

  const handlePhaseToggle = (phaseId: number) => {
    setExpandedPhases((prev: Record<number, boolean>) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const renderPhaseTable = (phaseId: number, phaseData: PhaseData, isTotal: boolean = false) => {
    const isExpanded = expandedPhases[phaseId];
    const columns = getPhaseTableHeaders(phaseId, []);
    const rowData = phaseData as unknown as Record<string, number>;

    return (
      <Box key={phaseId} sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: isTotal ? '#f5f5f5' : '#ffffff',
            p: 1,
            borderRadius: 1,
            mb: 1,
          }}
          onClick={() => handlePhaseToggle(phaseId)}
        >
          <IconButton size="small">
            <ExpandMoreIcon
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Phase {phaseId}
          </Typography>
        </Box>

        <Collapse in={isExpanded}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom du village</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: isTotal ? '#f0f0f0' : 'inherit' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                      {rowData[col.key] || 0}
                    </TableCell>
                  ))}
                </TableRow>
                {!isTotal &&
                  villageData.map((village: VillageRowData, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{village.villageName}</TableCell>
                      {columns.map((col) => {
                        const villagePhaseData = getTargetPhase(village, phaseId);
                        return (
                          <TableCell key={col.key}>
                            {villagePhaseData ? (villagePhaseData as unknown as Record<string, number>)[col.key] || 0 : 0}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
    );
  };

  if (data?.activityCountDetails?.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Aucune donnée disponible
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Statistiques par village
      </Typography>

      {renderPhaseTable(1, totalData?.phase1 || createEmptyPhaseData(1), true)}
      {renderPhaseTable(2, totalData?.phase2 || createEmptyPhaseData(2), true)}
      {renderPhaseTable(3, totalData?.phase3 || createEmptyPhaseData(3), true)}
    </Box>
  );
};

export default OneVillagePhaseTable;
