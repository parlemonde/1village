import React from 'react';

interface TableRowProps {
  rowData: {
    firstname: string;
    lastname: string;
    numOfAccountLinked: number;
    code: string;
  };
}

const TableRow: React.FC<TableRowProps> = ({ rowData }) => {
  return (
    <tr>
      <td></td>
      <td>
        {rowData.firstname} {rowData.lastname}
      </td>
      <td>{rowData.numOfAccountLinked}</td>
      <td>{rowData.code}</td>
      <td>Ayayo</td>
    </tr>
  );
};

export default TableRow;
