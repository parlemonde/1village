import React from 'react';

import useOpenController from '../../hooks/useOpenController';
import ExpendableButton from './ExpendableButton';
import TableRow from './TableRow';

interface TableSectionProps {
  rowData: {
    firstname: string;
    lastname: string;
    numOfAccountLinked: number;
    code: string;
  };
  index: number;
}

const TableSection: React.FC<TableSectionProps> = ({ rowData, index }) => {
  const { isOpen, toggle } = useOpenController(false);

  const defaultRowData = {
    firstname: '',
    lastname: '',
    numOfAccountLinked: 0,
    code: '',
  };

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
      {isOpen ? <TableRow rowData={rowData} /> : <TableRow rowData={defaultRowData} />}
    </tbody>
  );
};

export default TableSection;
