import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Checkbox } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useContext, useEffect, useState } from 'react';
import * as React from 'react';

import { DeleteButton } from '../buttons/DeleteButton';
import { deleteUserStudentRelation } from 'src/api/student/student.delete';
import { getUsersLinkedToStudent } from 'src/api/student/student.get';
import { ClassroomContext } from 'src/contexts/classroomContext';

function createData(
  name: string,
  numLinkedAccount: number,
  studentCode: string | undefined,
  users: { id: number; email: string; firstname: string; lastname: string }[],
  studentId: number,
  selected: boolean,
) {
  return {
    name,
    numLinkedAccount,
    studentCode,
    users,
    studentId,
    selected,
  };
}

function Row(props: {
  row: ReturnType<typeof createData>;
  isSelected: (id: number) => boolean;
  handleToggle: (id: number) => void;
  onPrint: (studentId?: number) => (event: React.MouseEvent, studentId?: number) => void;
  selectedStudentIds: number[];
  isKeywordMissing: boolean;
  handleDeleteUser: (studentId: number, userId: number) => void;
}) {
  // const { row, isSelected, handleToggle, onPrint, isKeywordMissing } = props;
  const { row, isSelected, handleToggle, onPrint, isKeywordMissing, handleDeleteUser } = props;
  const [open, setOpen] = useState(false);

  const createPrintHandler = (studentId?: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onPrint(studentId)(event);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected(row.studentId)} onChange={() => handleToggle(row.studentId)} disabled={isKeywordMissing} />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} disabled={isKeywordMissing}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {row.numLinkedAccount}
        </TableCell>
        <TableCell align="right">{row.studentCode}</TableCell>
        <TableCell align="right">
          <Button variant="outlined" size="small" onClick={createPrintHandler(row.studentId)} disabled={isKeywordMissing}>
            Télécharger la présentation
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} align="right" colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, marginLeft: 0 }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.users.map((user, index) => (
                    <TableRow key={index}>
                      {/* <TableCell>{row.users}</TableCell> */}
                      <TableCell style={{ fontSize: '0.8rem' }}>{user.email}</TableCell>
                      <TableCell style={{ fontSize: '0.8rem' }}>{user.firstname}</TableCell>
                      <TableCell style={{ fontSize: '0.8rem' }}>{user.lastname}</TableCell>
                      <TableCell sx={{ textAlign: 'center', paddingLeft: 5 }}>
                        <DeleteButton
                          confirmLabel={`Souhaitez-vous supprimer l’accès de ${user.email} ?`}
                          confirmTitle="Suppression d'accès"
                          color="red"
                          onDelete={async () => {
                            try {
                              await deleteUserStudentRelation(row.studentId, user.id);
                              handleDeleteUser(row.studentId, user.id);
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [numOfPresToPrint, setNumOfPresToPrint] = useState<number>(0);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const { classroom, students } = useContext(ClassroomContext);
  const [isKeywordMissing, setIsKeywordMissing] = useState(false);

  const [rows, setRows] = useState<
    {
      name: string;
      numLinkedAccount: number;
      studentCode: string | undefined;
      users: {
        id: number;
        email: string;
        firstname: string;
        lastname: string;
      }[];
      studentId: number;
      selected: boolean;
    }[]
  >([]);

  const isSelected = React.useCallback((id: number) => selectedStudentIds.includes(id), [selectedStudentIds]);

  React.useEffect(() => {
    const keyword = '%identifiant';
    if (classroom && classroom.defaultPrintMessage && !classroom.defaultPrintMessage.includes(keyword)) {
      setIsKeywordMissing(true);
    }
  }, [classroom]);

  const handleToggle = (id: number) => {
    const currentIndex = selectedStudentIds.indexOf(id);
    const newSelected = [...selectedStudentIds];

    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedStudentIds(newSelected);
    setNumOfPresToPrint(newSelected.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      const newRows = await Promise.all(
        students.map(async (student) => {
          const users = await getUsersLinkedToStudent(student.id);

          return createData(
            student.firstname + ' ' + student.lastname,
            student.numLinkedAccount || 0,
            student.hashedCode,
            users,
            student.id,
            isSelected(student.id),
          );
        }),
      );

      setRows(newRows);
    };

    fetchData();
  }, [isSelected, students]);

  // LOOK HEEEEEEEERE !!!!!!!!!!!!!!!!!!

  const handleDeleteUser = (studentId: number, userId: number) => {
    const newRows = rows.map((row) => {
      if (row.studentId === studentId) {
        const newUsers = row.users.filter((user) => user.id !== userId);
        const newNumAccountLinked = newUsers.length;
        return { ...row, users: newUsers, numLinkedAccount: newNumAccountLinked };
      }
      return row;
    });
    setRows(newRows);
  };

  const onPrint = (studentId?: number) => (event: React.MouseEvent) => {
    event.preventDefault();

    const idsToPrint = studentId !== undefined ? [studentId] : selectedStudentIds;

    const messagesWithId: string[] = [];
    let count = 0;

    idsToPrint.forEach((id) => {
      const student = students.find((student) => student.id === id);
      if (student) {
        const studentName = `${student.firstname} ${student.lastname}`;
        const studentCode = student.hashedCode;

        if (classroom) {
          const message = classroom.defaultPrintMessage
            ? classroom.defaultPrintMessage.replace('%identifiant', `<strong>${studentCode}</strong>`)
            : `
          <p>Bonjour, 
          </br>
          </br>
          Notre classe participe au projet 1Village, de l’association Par Le Monde, agréée par le ministère de l’éducation nationale français. 
          1Village est un projet de correspondances avec d’autres classes du monde, accessible de façon sécurisée sur un site internet.</p>
  
          <p>Si vous souhaitez accéder à ce site et observer les échanges en famille, il vous faut suivre cette démarche :</p>
          
          <ol>
          <li>Créer un compte sur https://1v.parlemonde.org/inscription, en renseignant une adresse email et un mot de passe.</li>
          <li>Confirmez votre adresse mail en cliquant sur le lien envoyé</li>
          <li>Connectez-vous sur https://1v.parlemonde.org/inscription et rattachez votre compte à l’identifiant unique <strong>${studentCode}</strong></li>
          </ol>
          
          <p>Jusqu’à 5 personnes de votre famille peuvent créer un compte et le rattacher à l’identifiant unique de votre enfant.
          </br>
          </br>
          Bonne journée</p>
          `;

          messagesWithId.push(`<div>Élève : <strong>${studentName}</strong></div>`);
          messagesWithId.push(message);
          messagesWithId.push(`<div>--------------------------------------------------------</div>`);
          count += 1;

          if (message.length > 700 && count === 2) {
            messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
            count = 0;
          } else if (message.length > 450 && count === 3) {
            messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
            count = 0;
          } else if (message.length > 200 && count === 4) {
            messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
            count = 0;
          } else if (count === 5) {
            messagesWithId.push(`<p style="page-break-after: always;">&nbsp;</p>`);
            count = 0;
          }
        }
      }
    });
    const printContentString = `<html><head><title>Présentations</title><meta charset="UTF-8"></head><body>${messagesWithId.join('')}</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContentString);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      console.error('Unable to open a new window for printing.');
    }
  };

  return (
    <>
      <Box marginTop="20px" textAlign="left">
        {isKeywordMissing && (
          <p style={{ color: 'red' }}>
            ATTENTION : le mot clé: <strong>%identifiant</strong> n&apos;est pas présent dans votre texte personnalisé, veuillez retourner à la page
            Communication afin de le modifier.
          </p>
        )}
        <Button id="myButton" variant="outlined" onClick={onPrint()} disabled={isKeywordMissing}>
          Télécharger {numOfPresToPrint <= 1 ? numOfPresToPrint + ' présentation' : numOfPresToPrint + ' présentations'}
        </Button>
      </Box>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Prénom et nom de l&apos;élève</TableCell>
              <TableCell align="right">Accès familles</TableCell>
              <TableCell align="right">Code élève</TableCell>
              <TableCell align="right" sx={{ paddingRight: 10 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.name}
                row={row}
                handleToggle={handleToggle}
                isSelected={isSelected}
                selectedStudentIds={selectedStudentIds}
                onPrint={onPrint}
                isKeywordMissing={isKeywordMissing}
                handleDeleteUser={handleDeleteUser}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
