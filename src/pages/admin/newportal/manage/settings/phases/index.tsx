import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { Button, Checkbox, Paper, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
  const villages = useGetVillages();
  const [villagePhases, setVillagePhases] = useState<{ [villageId: number]: VillagePhase }>({});
  const [goToNextStep, setGoToNextStep] = useState<{ [villageId: number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const steps = ['Discover', 'Exchange', 'Imagine'];
  useEffect(() => {
    if (villages.data) {
      villages.data.forEach((village: Village) => {
        setVillagePhases((prevState) => ({
          ...prevState,
          [village.id]: village.activePhase,
        }));
        setGoToNextStep({
          [village.id]: false,
        });
      });
      setGoToNextStep(villages.data.reduce((acc, village) => ({ ...acc, [village.id]: false }), {}));
    }
  }, [villages.data]);

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être médiateur, modérateur ou super admin.</h1>;
  }
  if (villages.isError) return <p>Error!</p>;
  if (villages.isLoading || villages.isIdle) return <p>Loading...</p>;

  const handleCheckboxChange = (villageId: number) => {
    setGoToNextStep((prevState) => ({
      ...prevState,
      [villageId]: !prevState[villageId],
    }));
  };

  const handleHeaderCheckboxChange = (checked: boolean) => {
    for (const key in villagePhases) {
      setGoToNextStep((prevState) => ({
        ...prevState,
        [key]: checked,
      }));
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
        <Button variant="outlined" disabled={Object.keys(goToNextStep).every((key) => !goToNextStep[+key])} onClick={handleLogCheckboxStates}>
          Passer à l&apos;étape suivante
        </Button>
        <SavePhasesModal villagePhases={villagePhases} goToNextStep={goToNextStep} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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
                  <TableCell align="center">
                    <Checkbox
                      checked={Object.keys(goToNextStep).every((key) => goToNextStep[+key])}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleHeaderCheckboxChange(event.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="center">Village-Monde</TableCell>
                  <TableCell align="center">Phases</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {villages.data.map((village: Village) => (
                  <TableRow key={village.id}>
                    <TableCell align="center">
                      <Checkbox
                        disabled={villagePhases[village.id] == VillagePhase.IMAGINE}
                        checked={!!goToNextStep[village.id]}
                        onChange={() => handleCheckboxChange(village.id)}
                      />
                    </TableCell>
                    <TableCell align="center">{village.name}</TableCell>
                    <TableCell align="center">
                      <Stepper activeStep={village.activePhase} alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </TableCell>
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
