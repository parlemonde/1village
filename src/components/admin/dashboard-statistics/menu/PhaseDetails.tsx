import * as React from 'react';
import { useState } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';

import ArrowRight from 'src/svg/arrow-right.svg';

const NAMES = {
  villageName: 'Nom du village',
  commentCount: 'Commentaires',
  draftCount: 'Brouillons',
  mascotCount: 'Mascottes',
  videoCount: 'Vidéos',
  enigmaCount: 'Enigmes',
  gameCount: 'Jeux',
  questionCount: 'Questions',
  reactionCount: 'Réactions',
  anthemCount: 'Hymnes',
  reinventStoryCount: 'Réécriture',
  challengeCount: 'Défis',
  reportingCount: 'Reportages',
  storyCount: 'Histoires',
};

interface PhaseDetailsProps {
  phase: number;
  data: Record<string, string | number>[];
}

const PhaseDetails = ({ phase, data }: PhaseDetailsProps) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const translateName = (key: keyof typeof NAMES) => {
    if (key in NAMES) {
      return NAMES[key];
    }

    return key;
  };

  return (
    <Accordion sx={{ boxShadow: 'none' }}>
      <AccordionSummary
        expandIcon={<ArrowRight style={{ transform: 'rotate(90deg)' }} />}
        sx={{
          backgroundColor: '#F5F5F5',
          padding: '0.8rem 1.4rem',
          borderRadius: '10px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h2>Phase {phase}</h2>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table sx={{ boxShadow: 'none', border: 'none' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell key={key} sortDirection={orderBy === key ? order : undefined}>
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : 'asc'}
                      IconComponent={KeyboardArrowUpIcon}
                      onClick={() => handleRequestSort(key)}
                    >
                      {translateName(key as keyof typeof NAMES)}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(data[0]).map((key, colIndex) => (
                    <TableCell key={colIndex}>{item[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default PhaseDetails;
