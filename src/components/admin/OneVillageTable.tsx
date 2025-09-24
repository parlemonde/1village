import React, { isValidElement, useMemo, useState } from 'react';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Paper, TableContainer, TableSortLabel, useTheme } from '@mui/material';
import NoSsr from '@mui/material/NoSsr';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import removeCountryFlagFromText from './manage/utils/removeCountryFlagFromText';
import { primaryColorLight } from 'src/styles/variables.const';
import { normalizeString } from 'src/utils/string';

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
  footerElementsLabel?: string;
  usePagination?: boolean;
  minTableHeightInPx?: number;
  rowStyle?: (row: any) => React.CSSProperties;
  tableLayout?: 'auto' | 'fixed';
}

export const OneVillageTable = ({
  'aria-label': ariaLabel,
  emptyPlaceholder,
  admin,
  data,
  columns,
  actions,
  titleContent,
  footerElementsLabel = 'élément',
  usePagination: usePaginationProp,
  minTableHeightInPx = 240,
  rowStyle,
  tableLayout = 'fixed',
}: OneVillageTableProps) => {
  const nbElementsWithoutTotal = data.length - 1;

  const theme = useTheme();
  const backgroundColor = admin ? theme.palette.secondary.main : primaryColorLight;
  const [options, setTableOptions] = useState<TableOptions>({
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
      if (prevOptions.order?.toLowerCase() === name.toLowerCase()) {
        return {
          ...prevOptions,
          page: 1,
          sort: prevOptions.sort === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return {
          ...prevOptions,
          page: 1,
          order: name.toLowerCase(),
          sort: 'asc',
        };
      }
    });
  };

  const usePagination = usePaginationProp !== undefined ? usePaginationProp : options.page !== undefined && options.limit !== undefined;
  const displayedData = useMemo(() => {
    const useSort = options.sort !== undefined && options.order !== undefined;
    const sortedData = useSort
      ? [...data].sort((a, b) => {
          const exactKey = Object.keys(a).find((key) => key.toLowerCase() === (options.order || '').toLowerCase()) || '';
          let aValue = a[exactKey] || '';
          let bValue = b[exactKey] || '';

          if (options.order?.toLowerCase() === 'country' || options.order?.toLowerCase() === 'countries') {
            aValue = removeCountryFlagFromText(aValue as string);
            bValue = removeCountryFlagFromText(bValue as string);
          }

          if (typeof aValue === 'string') aValue = normalizeString(aValue.toLowerCase());
          if (typeof bValue === 'string') bValue = normalizeString(bValue.toLowerCase());

          if (isValidElement(aValue)) {
            const key = aValue.key?.toString() || '';
            aValue = key.toLowerCase();
          }
          if (isValidElement(bValue)) {
            const key = bValue.key?.toString() || '';
            bValue = key.toLowerCase();
          }

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
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ minHeight: `${minTableHeightInPx + 2}px`, maxWidth: '48.5rem' }}>
          {titleContent && (
            <Box sx={{ fontWeight: 'bold', display: 'flex', border: 'none', backgroundColor, p: '8px' }}>
              <RemoveRedEyeIcon sx={{ mr: '6px' }} /> {titleContent}
            </Box>
          )}
          <Table size="small" aria-label={ariaLabel} sx={{ tableLayout }}>
            {nbElementsWithoutTotal === 0 ? (
              <TableBody>
                <TableRow sx={{ height: '242px' }}>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                    {emptyPlaceholder || 'Cette liste est vide !'}
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <>
                <TableHead
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  <TableRow
                    sx={{
                      th: {
                        paddingY: 2,
                        borderBottom: '1px solid blue',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        sx={{
                          fontWeight: 'bold',
                        }}
                      >
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
                      <TableCell style={{ fontWeight: 'bold', width: '80px' }} align="right">
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    td: {
                      display: 'table-cell',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  {displayedData.map((d, index) => {
                    const customStyle = rowStyle ? rowStyle(d) : {};
                    return (
                      <TableRow key={d.id} style={customStyle}>
                        {columns.map((c) => (
                          <TableCell
                            key={`${d.id}_${c.key}`}
                            size="small"
                            title={typeof d[c.key] === 'string' ? (d[c.key] as string) : ''}
                            style={customStyle}
                          >
                            {d[c.key] !== undefined ? d[c.key] : ''}
                          </TableCell>
                        ))}
                        {actions && (
                          <TableCell align="right" padding="none" sx={{ width: '20px', color: 'blue' }}>
                            {actions(d.id, index)}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {usePagination && nbElementsWithoutTotal > 5 ? (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              count={nbElementsWithoutTotal}
              rowsPerPage={options.limit || 10}
              page={(options.page || 1) - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => (
                <span>{`${from} - ${to} sur ${count} ${footerElementsLabel}${nbElementsWithoutTotal > 0 ? 's' : ''}`}</span>
              )}
            />
          ) : (
            <p style={{ margin: 0, padding: '0', textAlign: 'right', fontSize: '14px' }}>{`${nbElementsWithoutTotal} ${footerElementsLabel}${
              displayedData.length > 1 ? 's' : ''
            }`}</p>
          )}
        </Box>
      </Paper>
    </NoSsr>
  );
};
