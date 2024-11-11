import React from 'react';

import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';

function createData(classroom: string, vm: sting, prof: string, status: string) {
  return { classroom, vm, prof, status };
}

const rows = [
  createData('École Robert Desnos', 'France-Canada', 'Karine Marchand', '3 semaines sans connexion'),
  createData('École Jules Ferry', 'France-Canada', 'Karine Marchand', '3 semaines sans connexion'),
  createData('École Claude Gelée', 'France-Canada', 'Karine Marchand', '3 semaines sans connexion'),
  createData('École Louis Armand', 'France-Canada', 'Karine Marchand', 'Accumulation de brouillons'),
  createData('École Louis Renard', 'France-Canada', 'Karine Marchand', 'Accumulation de brouillons'),
  createData('École Maurice Ravel', 'France-Canada', 'Karine Marchand', 'Aucune connexion'),
  createData('École Mirion Malle', 'France-Canada', 'Karine Marchand', 'Aucune connexion'),
];

export default function DashboardTable() {
  return (
    <Paper elevation={3} sx={{ borderRadius: '10px', backgroundColor: '#f5f5ff', border: '1px solid #4C3ED9' }}>
      <Box sx={{ marginBottom: 2, padding: 2, backgroundColor: '#E8E8F9', borderRadius: '15px 15px 0 0px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          À surveiller
        </Typography>
      </Box>
      <TableContainer sx={{ padding: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tableau de surveillance">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                Classe
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                Village - Monde
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                Professeur
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                Statut
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">{row.classroom}</TableCell>
                <TableCell align="left">{row.vm}</TableCell>
                <TableCell align="left">{row.prof}</TableCell>
                <TableCell align="left">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
