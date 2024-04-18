import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useGetVillages } from 'src/api/villages/villages.get';
import { UserContext } from 'src/contexts/userContext';
import { SavePhasesModal } from './SavePhasesModal';
import { primaryColor } from 'src/styles/variables.const';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';
import type { Village } from 'types/village.type';
import { VillagePhase } from 'types/village.type';

const Phases = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN];
  const [villagePhases, setVillagePhases] = useState<{ [villageId: number]: VillagePhase }>({});
  const villages = useGetVillages();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (villages.data) {
      const newVillagePhases: { [villageId: number]: VillagePhase } = {};
      villages.data.forEach((village: Village) => {
        newVillagePhases[village.id] = village.activePhase;
      });
      setVillagePhases(newVillagePhases);
    }
  }, [villages.data]);

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être médiateur, modérateur ou super admin.</h1>;
  }
  if (villages.isError) return <p>Error!</p>;
  if (villages.isLoading || villages.isIdle) return <p>Loading...</p>;

  // Fonction pour gérer le changement d'état de la case à cocher
  const handleCheckboxChange = (villageId: number, phase: VillagePhase) => {
    setVillagePhases((prevState) => ({
      ...prevState,
      [villageId]: phase,
    }));
  };

  const handleHeaderCheckboxChange = (phase: VillagePhase) => {
    const newVillagePhases: { [villageId: number]: VillagePhase } = {};
    villages.data.forEach((village: Village) => {
      newVillagePhases[village.id] = phase;
    });
    setVillagePhases(newVillagePhases);
  };

  const handleLogCheckboxStates = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Paramétrer les phases</h1>
        </div>
      </Link>
      <div style={{ textAlign: 'right', marginTop: 30, marginBottom: 30 }}>
        <Button variant="outlined" onClick={handleLogCheckboxStates}>
          Enregistrer les paramètres
        </Button>
        <SavePhasesModal villagePhases={villagePhases} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Paper>
          <TableContainer
            sx={{
              color: primaryColor,
              border: 1,
              borderRadius: '20px',
            }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{
                borderCollapse: 'collapse',
                borderStyle: 'hidden',
                '& th, & td': {
                  borderTop: 1,
                  borderColor: primaryColor,
                },
              }}
            >
              <TableHead
                sx={{
                  '& .MuiTableCell-root': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <TableRow>
                  <TableCell align="center">Village-Monde</TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={Object.values(villagePhases).every((phase) => phase === VillagePhase.DISCOVER)}
                      onChange={() => handleHeaderCheckboxChange(VillagePhase.DISCOVER)}
                    />
                    Phase 1
                  </TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={Object.values(villagePhases).every((phase) => phase === VillagePhase.EXCHANGE)}
                      onChange={() => handleHeaderCheckboxChange(VillagePhase.EXCHANGE)}
                    />
                    Phase 2
                  </TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={Object.values(villagePhases).every((phase) => phase === VillagePhase.IMAGINE)}
                      onChange={() => handleHeaderCheckboxChange(VillagePhase.IMAGINE)}
                    />
                    Phase 3
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {villages.data.map((village: Village) => (
                  <TableRow key={village.id}>
                    <TableCell align="center">{village.name}</TableCell>
                    {[1, 2, 3].map((phase) => (
                      <TableCell align="left" key={phase}>
                        <Checkbox
                          checked={villagePhases[village.id] === phase ? true : false}
                          onChange={() => handleCheckboxChange(village.id, phase)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default Phases;
