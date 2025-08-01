import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import type { VillageStats } from 'types/statistics.type';

interface OneVillagePhaseTableProps {
  data?: VillageStats;
}

interface PhaseData {
  phaseId: number;
  mascotCount: number;
  videoCount: number;
  draftCount: number;
  commentCount: number;
  challengeCount: number;
  enigmaCount: number;
  gameCount: number;
  questionCount: number;
  reactionCount: number;
  reportingCount: number;
  storyCount: number;
  anthemCount: number;
  reinventStoryCount: number;
  contentLibreCount: number;
}

interface VillageRowData {
  villageName: string;
  phase1: PhaseData;
  phase2: PhaseData;
  phase3: PhaseData;
}

const OneVillagePhaseTable: React.FC<OneVillagePhaseTableProps> = ({ data }) => {
  const [expandedPhases, setExpandedPhases] = React.useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const villageData = useMemo(() => {
    if (!data?.activityCountDetails) return [];

    const villages: VillageRowData[] = [];

    data.activityCountDetails.forEach((villageDetail) => {
      const villageRow: VillageRowData = {
        villageName: villageDetail.villageName,
        phase1: {
          phaseId: 1,
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
          reinventStoryCount: 0,
          contentLibreCount: 0,
        },
        phase2: {
          phaseId: 2,
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
          reinventStoryCount: 0,
          contentLibreCount: 0,
        },
        phase3: {
          phaseId: 3,
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
          reinventStoryCount: 0,
          contentLibreCount: 0,
        },
      };

      // Aggregate data from all classrooms in the village
      villageDetail.classrooms.forEach((classroom) => {
        classroom.phaseDetails.forEach((phase) => {
          const targetPhase =
            phase.phaseId === 1 ? villageRow.phase1 : phase.phaseId === 2 ? villageRow.phase2 : phase.phaseId === 3 ? villageRow.phase3 : null;

          if (targetPhase) {
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
            targetPhase.reinventStoryCount += phase.reinventStoryCount || 0;
            targetPhase.contentLibreCount += (phase as any).contentLibreCount || 0;
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
      phase1: {
        phaseId: 1,
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
        reinventStoryCount: 0,
        contentLibreCount: 0,
      },
      phase2: {
        phaseId: 2,
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
        reinventStoryCount: 0,
        contentLibreCount: 0,
      },
      phase3: {
        phaseId: 3,
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
        reinventStoryCount: 0,
        contentLibreCount: 0,
      },
    };

    villageData.forEach((village) => {
      total.phase1.mascotCount += village.phase1.mascotCount;
      total.phase1.videoCount += village.phase1.videoCount;
      total.phase1.draftCount += village.phase1.draftCount;
      total.phase1.commentCount += village.phase1.commentCount;
      total.phase1.contentLibreCount += village.phase1.contentLibreCount;

      total.phase2.reportingCount += village.phase2.reportingCount;
      total.phase2.challengeCount += village.phase2.challengeCount;
      total.phase2.enigmaCount += village.phase2.enigmaCount;
      total.phase2.gameCount += village.phase2.gameCount;
      total.phase2.questionCount += village.phase2.questionCount;
      total.phase2.reactionCount += village.phase2.reactionCount;
      total.phase2.storyCount += village.phase2.storyCount;
      total.phase2.videoCount += village.phase2.videoCount;
      total.phase2.commentCount += village.phase2.commentCount;

      total.phase3.anthemCount += village.phase3.anthemCount;
      total.phase3.reinventStoryCount += village.phase3.reinventStoryCount;
      total.phase3.videoCount += village.phase3.videoCount;
      total.phase3.commentCount += village.phase3.commentCount;
      total.phase3.draftCount += village.phase3.draftCount;
    });

    return total;
  }, [villageData]);

  const handlePhaseToggle = (phaseId: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const renderPhaseTable = (phaseId: number, phaseData: PhaseData, isTotal: boolean = false) => {
    const isExpanded = expandedPhases[phaseId];

    let columns: { key: string; label: string }[] = [];
    let rowData: Record<string, number> = {};

    if (phaseId === 1) {
      columns = [
        { key: 'mascotCount', label: 'Mascottes' },
        { key: 'videoCount', label: 'Vidéos' },
        { key: 'draftCount', label: 'Brouillons' },
        { key: 'commentCount', label: 'Commentaires' },
      ];
      rowData = {
        mascotCount: phaseData.mascotCount,
        videoCount: phaseData.videoCount,
        draftCount: phaseData.draftCount,
        commentCount: phaseData.commentCount,
      };
    } else if (phaseId === 2) {
      columns = [
        { key: 'reportingCount', label: 'Reportages' },
        { key: 'challengeCount', label: 'Défis' },
        { key: 'enigmaCount', label: 'Énigmes' },
        { key: 'gameCount', label: 'Jeux' },
        { key: 'questionCount', label: 'Questions' },
        { key: 'reactionCount', label: 'Réactions' },
        { key: 'storyCount', label: 'Histoire' },
        { key: 'videoCount', label: 'Vidéos' },
        { key: 'commentCount', label: 'Commentaires' },
      ];
      rowData = {
        reportingCount: phaseData.reportingCount,
        challengeCount: phaseData.challengeCount,
        enigmaCount: phaseData.enigmaCount,
        gameCount: phaseData.gameCount,
        questionCount: phaseData.questionCount,
        reactionCount: phaseData.reactionCount,
        storyCount: phaseData.storyCount,
        videoCount: phaseData.videoCount,
        commentCount: phaseData.commentCount,
      };
    } else if (phaseId === 3) {
      columns = [
        { key: 'anthemCount', label: 'Hymne' },
        { key: 'reinventStoryCount', label: 'Réécriture' },
        { key: 'videoCount', label: 'Vidéos' },
        { key: 'commentCount', label: 'Commentaires' },
        { key: 'draftCount', label: 'Brouillons' },
      ];
      rowData = {
        anthemCount: phaseData.anthemCount,
        reinventStoryCount: phaseData.reinventStoryCount,
        videoCount: phaseData.videoCount,
        commentCount: phaseData.commentCount,
        draftCount: phaseData.draftCount,
      };
    }

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
                  <TableCell sx={{ fontWeight: 'bold' }}>{isTotal ? 'Total' : 'Total'}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                      {rowData[col.key] || 0}
                    </TableCell>
                  ))}
                </TableRow>
                {!isTotal &&
                  villageData.map((village, index) => (
                    <TableRow key={index}>
                      <TableCell>{village.villageName}</TableCell>
                      {columns.map((col) => {
                        const villagePhaseData =
                          phaseId === 1 ? village.phase1 : phaseId === 2 ? village.phase2 : phaseId === 3 ? village.phase3 : null;
                        return <TableCell key={col.key}>{villagePhaseData ? villagePhaseData[col.key as keyof PhaseData] || 0 : 0}</TableCell>;
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

  if (!data || !data.activityCountDetails || data.activityCountDetails.length === 0) {
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

      {renderPhaseTable(1, totalData?.phase1 || ({ phaseId: 1 } as PhaseData), true)}
      {renderPhaseTable(2, totalData?.phase2 || ({ phaseId: 2 } as PhaseData), true)}
      {renderPhaseTable(3, totalData?.phase3 || ({ phaseId: 3 } as PhaseData), true)}
    </Box>
  );
};

export default OneVillagePhaseTable;
