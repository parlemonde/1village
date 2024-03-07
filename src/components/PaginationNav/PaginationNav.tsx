import React from 'react';

import type { SelectChangeEvent } from '@mui/material';
import { InputLabel, MenuItem, Pagination, Select } from '@mui/material';

import styles from './PaginationNav.module.css';

interface PaginationNavProps {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  handlePage: (_: React.ChangeEvent<unknown>, value: number) => void;
  handleItemsPerPage: (e: SelectChangeEvent<string>) => void;
}

const PaginationNav = ({ page, itemsPerPage, totalItems, handlePage, handleItemsPerPage }: PaginationNavProps) => {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.itemsPerPageContainer}>
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
      </div>
      {totalItems > itemsPerPage && (
        <Pagination
          count={Math.ceil(totalItems / itemsPerPage)}
          page={page}
          onChange={handlePage}
          variant="outlined"
          sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '0' }}
        />
      )}
    </div>
  );
};
export default PaginationNav;
