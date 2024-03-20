import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

import type { Classroom } from 'types/classroom.type';

interface ClassroomsToWatchTableProps {
  classrooms: Classroom[];
}

const ClassroomsToWatchTable = ({ classrooms }: ClassroomsToWatchTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Classe</TableCell>
            <TableCell>Village-monde</TableCell>
            <TableCell>Pays</TableCell>
            <TableCell>Professeur</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classrooms &&
            classrooms.map((classroom) => (
              <TableRow key={classroom.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {classroom.name}
                </TableCell>
                <TableCell>{classroom.villageId}</TableCell>
                <TableCell>{classroom.country?.name}</TableCell>
                <TableCell>{classroom.userId}</TableCell>
                {/* <TableCell align="right">{classroom.status}</TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassroomsToWatchTable;
