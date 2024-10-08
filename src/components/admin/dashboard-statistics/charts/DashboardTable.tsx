import React from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import type { FamiliesWithoutAccount } from 'types/statistics.type';

function createRows(data: FamiliesWithoutAccount[]): FamiliesWithoutAccountRow[] {
  return data.map((row) => {
    return {
      id: row.student_id,
      student: `${row.student_firstname} ${row.student_lastname}`,
      vm: row.village_name,
      user: `${row.user_firstname} ${row.user_lastname}`,
      status: 'Compte non créé',
    };
  });
}

/* const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]; */

/* const getHeaders = (data: []) => {
  return Object.keys(data[0]);
}; */
/* const getRows = (data: []) => {
  return data.map((row) => )
}; */

const FamiliesWithoutAccountHeaders = ['Enfant', 'Professeur', 'Village-Monde', 'Statut'];

interface FamiliesWithoutAccountRow {
  id: number;
  student: string;
  user: string;
  vm: string;
  status: string;
}

interface DashboardTableProps {
  data: FamiliesWithoutAccount[] | undefined;
}

export default function DashboardTable({ data }: DashboardTableProps) {
  const [rows, setRows] = React.useState<FamiliesWithoutAccountRow[]>([]);
  React.useEffect(() => {
    if (data) {
      setRows([]);
      setRows(createRows(data));
    }
  }, [data]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>À surveiller</TableCell>
          </TableRow>
          <TableRow>
            {FamiliesWithoutAccountHeaders.map((header) => (
              <>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="right">{row.student}</TableCell>
              <TableCell align="right">{row.user}</TableCell>
              <TableCell align="right">{row.vm}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
