import React from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, TableContainer, TableSortLabel, useTheme } from '@mui/material';
import NoSsr from '@mui/material/NoSsr';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { primaryColorLight } from 'src/styles/variables.const';

function paginate<T>(array: T[], pageSize: number, pageNumber: number): T[] {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export interface TableOptions {
  limit?: number;
  page?: number;
  order?: string;
  sort?: 'asc' | 'desc';
  search?: string;
}
interface OneVillageTableProps {
  'aria-label'?: string;
  admin: boolean;
  emptyPlaceholder: React.ReactNode | React.ReactNodeArray;
  data: Array<{ id: string | number; [key: string]: string | boolean | number | React.ReactNode }>;
  columns: Array<{ key: string; label: string; sortable?: boolean }>;
  actions?(id: string | number, index: number): React.ReactNode | React.ReactNodeArray;
  titleContent?: string;
  usePagination?: boolean;
}

export const OneVillageTable = ({
  'aria-label': ariaLabel,
  emptyPlaceholder,
  admin,
  data,
  columns,
  actions,
  titleContent,
  usePagination: usePaginationProp,
}: OneVillageTableProps) => {
  const theme = useTheme();
  const color = admin ? 'white' : 'black';
  const backgroundColor = admin ? theme.palette.secondary.main : primaryColorLight;
  const [options, setTableOptions] = React.useState<TableOptions>({
    page: 1,
    limit: 10,
    sort: 'asc',
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setTableOptions((prevOptions) => ({ ...prevOptions, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableOptions((prevOptions) => ({
      ...prevOptions,
      page: 1,
      limit: parseInt(event.target.value, 10),
    }));
  };
  const onSortBy = (name: string) => () => {
    setTableOptions((prevOptions) => {
      if (prevOptions.order === name) {
        return {
          ...prevOptions,
          page: 1,
          sort: prevOptions.sort === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return { ...prevOptions, page: 1, order: name };
      }
    });
  };

  const usePagination = usePaginationProp !== undefined ? usePaginationProp : options.page !== undefined && options.limit !== undefined;
  const displayedData = React.useMemo(() => {
    const useSort = options.sort !== undefined && options.order !== undefined;
    const sortedData = useSort
      ? [...data].sort((a, b) => {
          const aValue = a[options.order || ''] || '';
          const bValue = b[options.order || ''] || '';

          if (aValue > bValue) {
            return options.sort === 'asc' ? 1 : -1;
          } else if (aValue < bValue) {
            return options.sort === 'asc' ? -1 : 1;
          } else {
            return 0;
          }
        })
      : data;
    return usePagination ? paginate(sortedData, options.limit || 10, options.page || 1) : sortedData;
  }, [data, options.sort, options.order, options.limit, options.page, usePagination]);

  return (
    <NoSsr>
      <TableContainer sx={{ border: '1px solid blue', borderRadius: '24px' }}>
        {titleContent && (
          <Box sx={{ fontWeight: 'bold', display: 'flex', border: 'none', backgroundColor, p: '8px' }}>
            <RemoveRedEyeIcon sx={{ mr: '6px' }} /> {titleContent}
          </Box>
        )}
        <Table size="medium" aria-label={ariaLabel}>
          {data.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  {emptyPlaceholder || 'Cette liste est vide !'}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableHead
                sx={{
                  zIndex: 1000,
                  fontWeight: 'bold',
                  minHeight: 'unset',
                  padding: '8px 8px 8px 16px',
                  color: 'red',
                }}
              >
                <TableRow
                  sx={{
                    th: {
                      borderBottom: '1px solid blue',
                    },
                  }}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} sx={{ fontWeight: 'bold' }}>
                      {c.sortable ? (
                        <TableSortLabel active={options.order === c.key} direction={options.sort} onClick={onSortBy(c.key)}>
                          {c.label}
                          {options.order === c.label ? (
                            <span
                              style={{
                                border: 0,
                                clip: 'rect(0 0 0 0)',
                                height: 1,
                                margin: -1,
                                overflow: 'hidden',
                                padding: 0,
                                position: 'absolute',
                                top: 20,
                                width: 1,
                              }}
                            >
                              {options.sort === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        c.label
                      )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell style={{ fontWeight: 'bold' }} align="right">
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((d, index) => (
                  <TableRow key={d.id}>
                    {columns.map((c) => {
                      return <TableCell key={`${d.id}_${c.key}`}>{d[c.key] !== undefined ? d[c.key] : ''}</TableCell>;
                    })}
                    {actions && (
                      <TableCell align="center" padding="none" sx={{ minWidth: '96px', color: 'blue' }}>
                        {/* {actions(d.id, index)} */}
                        <MoreVertIcon />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {usePagination && (
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={data.length}
                      rowsPerPage={options.limit || 10}
                      page={(options.page || 1) - 1}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </NoSsr>
  );
};
