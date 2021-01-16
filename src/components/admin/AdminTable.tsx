import React from "react";

import NoSsr from "@material-ui/core/NoSsr";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";

const useTableStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      fontWeight: "bold",
      minHeight: "unset",
      padding: "8px 8px 8px 16px",
    },
    title: {
      flex: "1 1 100%",
    },
    button: {
      color: "white",
    },
  }),
);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      backgroundColor: "white",
      "&:nth-of-type(even)": {
        backgroundColor: "rgb(224 239 232)",
      },
      "&.sortable-ghost": {
        opacity: 0,
      },
    },
  }),
)(TableRow);

interface AdminTableProps {
  "aria-label"?: string;
  emptyPlaceholder: React.ReactNode | React.ReactNodeArray;
  data: Array<{ id: string | number; [key: string]: string | boolean | number }>;
  columns: Array<{ key: string; label: string }>;
  actions?(id: string | number, index: number): React.ReactNode | React.ReactNodeArray;
}

export const AdminTable: React.FC<AdminTableProps> = ({ "aria-label": ariaLabel, emptyPlaceholder, data, columns, actions }: AdminTableProps) => {
  const classes = useTableStyles();
  return (
    <NoSsr>
      <Table size="medium" aria-label={ariaLabel}>
        {data.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                {emptyPlaceholder || "Cette liste est vide !"}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <>
            <TableHead style={{ borderBottom: "1px solid white" }} className={classes.toolbar}>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.key} style={{ color: "white", fontWeight: "bold" }}>
                    {c.label}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((d, index) => (
                <StyledTableRow key={d.id}>
                  {columns.map((c) => (
                    <TableCell key={`${d.id}_${c.key}`}>{d[c.key] || ""}</TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right" padding="none" style={{ minWidth: "96px" }}>
                      {actions(d.id, index)}
                    </TableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </NoSsr>
  );
};
