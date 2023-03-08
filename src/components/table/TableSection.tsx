import React from 'react';

import { TableRow } from '@mui/material';

import useOpenController from '../../hooks/useOpenController';
import ExpendableButton from './ExpendableButton';

const TableSection = ({ rowData, index }) => {
  const { isOpen, toggle } = useOpenController(false);

  return (
    <tbody>
      <td className="button-td">
        <ExpendableButton isOpen={isOpen} toggle={toggle} />
      </td>
      <td>
        <b> Student: {index}</b>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      {isOpen && <TableRow rowData={rowData} />}
    </tbody>
  );
};

export default TableSection;
