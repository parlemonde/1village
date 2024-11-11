import { Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { useGetVillages } from 'src/api/villages/villages.get';
import { SavePhasesModal } from 'src/components/admin/manage/settings/SavePhasesModal';
import { UserContext } from 'src/contexts/userContext';
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleCheckboxChange = (villageId: number, phase: VillagePhase, checked: boolean) => {
    if (phase === VillagePhase.EXCHANGE || phase === VillagePhase.IMAGINE) {
      setVillagePhases((prevState) => ({
        ...prevState,
        [villageId]: checked ? phase : phase - 1,
      }));
    } else {
      setVillagePhases((prevState) => ({
        ...prevState,
        [villageId]: 1,
      }));
    }
  };

  const handleHeaderCheckboxChange = (phase: VillagePhase, checked: boolean) => {
    for (const key in villagePhases) {
      if (villagePhases[key] <= phase) {
        villagePhases[key] = VillagePhase.DISCOVER;
        setVillagePhases((prevState) => ({
          ...prevState,
          [key]: checked ? phase : phase - 1,
        }));
      }
    }
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
                  <TableCell align="left">Phase 1</TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={Object.values(villagePhases).every((phase) => phase >= VillagePhase.EXCHANGE)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleHeaderCheckboxChange(VillagePhase.EXCHANGE, event.target.checked)
                      }
                    />
                    Phase 2
                  </TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={Object.values(villagePhases).every((phase) => phase === VillagePhase.IMAGINE)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleHeaderCheckboxChange(VillagePhase.IMAGINE, event.target.checked)
                      }
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
                          checked={villagePhases[village.id] >= phase ? true : false}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(village.id, phase, event.target.checked)}
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
