import React from 'react';

import type { SelectChangeEvent } from '@mui/material';
import { InputLabel, MenuItem, Pagination, Select, Stack } from '@mui/material';

interface PaginationNavProps {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  handlePage: (_: React.ChangeEvent<unknown>, value: number) => void;
  handleItemsPerPage: (e: SelectChangeEvent<string>) => void;
}

const PaginationNav = ({ page, itemsPerPage, totalItems, handlePage, handleItemsPerPage }: PaginationNavProps) => {
  return (
    <Stack direction="row" spacing={4} alignItems="center" justifyContent="flex-start">
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <InputLabel id="activities-per-page-label">Activités par page</InputLabel>
        <Select
          labelId="activities-per-page-label"
          variant="standard"
          size="small"
          id="demo-simple-select-standard"
          value={itemsPerPage.toString()}
          onChange={handleItemsPerPage}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>
      </Stack>
      {totalItems > itemsPerPage && <Pagination count={Math.ceil(totalItems / itemsPerPage)} page={page} onChange={handlePage} variant="outlined" />}
    </Stack>
  );
};
export default PaginationNav;
