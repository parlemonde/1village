import React from 'react';

import NoSsr from '@material-ui/core/NoSsr';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Table from '@material-ui/core/Table';
import type { Theme as MaterialTheme } from '@material-ui/core/styles';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';

const useTableStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      fontWeight: 'bold',
      minHeight: 'unset',
      padding: '8px 8px 8px 16px',
    },
    title: {
      flex: '1 1 100%',
    },
    button: {
      color: 'white',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      backgroundColor: 'white',
      '&:nth-of-type(even)': {
        backgroundColor: 'rgb(224 239 232)',
      },
      '&.sortable-ghost': {
        opacity: 0,
      },
    },
  }),
)(TableRow);

function paginate<T>(array: T[], page_size: number, page_number: number): T[] {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

interface TableOptions {
  limit?: number;
  page?: number;
  order?: string;
  sort?: 'asc' | 'desc';
  search?: string;
}
interface AdminTableProps {
  'aria-label'?: string;
  emptyPlaceholder: React.ReactNode | React.ReactNodeArray;
  data: Array<{ id: string | number; [key: string]: string | boolean | number | React.ReactNode }>;
  columns: Array<{ key: string; label: string; sortable?: boolean }>;
  actions?(id: string | number, index: number): React.ReactNode | React.ReactNodeArray;
}

export const AdminTable = ({ 'aria-label': ariaLabel, emptyPlaceholder, data, columns, actions }: AdminTableProps) => {
  const classes = useTableStyles();
  const [options, setTableOptions] = React.useState<TableOptions>({
    page: 1,
    limit: 10,
    sort: 'asc',
  });
  const handleChangePage = (_event: unknown, newPage: number) => {
    setTableOptions({ ...options, page: newPage + 1 });
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableOptions({ ...options, page: 1, limit: parseInt(event.target.value, 10) });
  };
  const onSortBy = (name: string) => () => {
    if (options.order === name) {
      setTableOptions({ ...options, page: 1, sort: options.sort === 'asc' ? 'desc' : 'asc' });
    } else {
      setTableOptions({ ...options, page: 1, order: name });
    }
  };

  const usePagination = options.page !== undefined && options.limit !== undefined;
  const displayedData = React.useMemo(() => {
    const useSort = options.sort !== undefined && options.order !== undefined;
    const sortedData = useSort
      ? data.sort((a, b) => {
          return a[options.order] >= b[options.order] ? (options.sort === 'asc' ? 1 : -1) : options.sort === 'asc' ? -1 : 1;
        })
      : data;
    return usePagination ? paginate(sortedData, options.limit || 10, options.page || 1) : sortedData;
  }, [data, options.sort, options.order, options.limit, options.page, usePagination]);

  return (
    <NoSsr>
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
            <TableHead style={{ borderBottom: '1px solid white' }} className={classes.toolbar}>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.key} style={{ color: 'white', fontWeight: 'bold' }}>
                    {c.sortable ? (
                      <TableSortLabel active={options.order === c.key} direction={options.sort} onClick={onSortBy(c.key)}>
                        {c.label}
                        {options.order === c.label ? (
                          <span className={classes.visuallyHidden}>{options.sort === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      c.label
                    )}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="right">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((d, index) => (
                <StyledTableRow key={d.id}>
                  {columns.map((c) => (
                    <TableCell key={`${d.id}_${c.key}`}>{d[c.key] !== undefined ? d[c.key] : ''}</TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right" padding="none" style={{ minWidth: '96px' }}>
                      {actions(d.id, index)}
                    </TableCell>
                  )}
                </StyledTableRow>
              ))}
              {usePagination && (
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={data.length}
                    rowsPerPage={options.limit || 10}
                    page={(options.page || 1) - 1}
                    onPageChange={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              )}
            </TableBody>
          </>
        )}
      </Table>
    </NoSsr>
  );
};
