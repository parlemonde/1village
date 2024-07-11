import React from 'react';

import type { SelectChangeEvent } from '@mui/material';
import { Box, InputLabel, MenuItem, Pagination, Select } from '@mui/material';

interface PaginationNavProps {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  handlePage: (_: React.ChangeEvent<unknown>, value: number) => void;
  handleItemsPerPage: (e: SelectChangeEvent<string>) => void;
}

const PaginationNav = ({ page, itemsPerPage, totalItems, handlePage, handleItemsPerPage }: PaginationNavProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box alignSelf="start" mb="1rem">
        <InputLabel id="activities-per-page-label" sx={{ fontSize: '.9rem', marginRight: '18px', display: 'inline' }}>
          Activités par page
        </InputLabel>
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
      </Box>
      {totalItems > itemsPerPage && <Pagination count={Math.ceil(totalItems / itemsPerPage)} page={page} onChange={handlePage} variant="outlined" />}
    </Box>
  );
};
export default PaginationNav;
