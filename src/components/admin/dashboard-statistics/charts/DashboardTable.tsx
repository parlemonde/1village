import React from 'react';

import { TableSortLabel } from '@mui/material';
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
      classroom: row.classroom_name,
      country: row.classroom_country,
      creationDate: 'À venir',
    };
  });
}

const FamiliesWithoutAccountHeaders = ['Nom Prénom Enfant', 'Village-Monde', 'Classe', 'Pays', 'Date de création identifiant'];

interface FamiliesWithoutAccountRow {
  id: number;
  student: string;
  classroom: string;
  vm: string;
  country: string;
  creationDate: string;
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
            <TableCell sx={{ fontWeight: 'bold' }}>À surveiller : comptes non créés ({rows.length})</TableCell>
          </TableRow>
          <TableRow>
            {FamiliesWithoutAccountHeaders.map((header) => (
              <>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel active>{header}</TableSortLabel>
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="right">{row.student}</TableCell>
              <TableCell align="right">{row.vm}</TableCell>
              <TableCell align="right">{row.classroom}</TableCell>
              <TableCell align="right">{row.country}</TableCell>
              <TableCell align="right">{row.creationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
