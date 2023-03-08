import React from 'react';

import { TableSection } from './TableSection.jsx';

const TableRow = ({ rowData }) => {
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
