import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import BackArrow from 'src/svg/back-arrow.svg';
import { useGetVillages } from 'src/api/villages/villages.get';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { VillagePhase, Village } from 'types/village.type';


const Phases = () => {
  // Initialiser l'état local pour garder en mémoire les états des cases à cocher
  const [villagePhases, setVillagePhases] = useState<{ [villageId: number]: VillagePhase }>({});
  const villages = useGetVillages();

  useEffect(() => {
    // Initialisation de l'état local avec les valeurs de l'état en base de données
    if (villages.data) {
      const newVillagePhases: { [villageId: number]: VillagePhase } = {};
      villages.data.forEach((village: Village) => {
        newVillagePhases[village.id] = village.activePhase || 0;
      });
      setVillagePhases(newVillagePhases);
    }
  }, [villages.data]);

  if (villages.isError) return <p>Error!</p>;
  if (villages.isLoading || villages.isIdle) return <p>Loading...</p>;

  // Fonction pour gérer le changement d'état de la case à cocher
  const handleCheckboxChange = (villageId: number, phase: VillagePhase) => {
    setVillagePhases(prevState  => ({
      ...prevState,
      [villageId]: phase
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
    console.log('États des checkboxes :', villagePhases);
  };

  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Paramétrer les phases</h1>
        </div>
      </Link>
      <div style={{ textAlign: 'right' }}>
        <Button variant="contained" onClick={handleLogCheckboxStates}>Enregistrer les paramètres</Button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Paper >
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Village-Monde</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={Object.values(villagePhases).every(phase => phase === VillagePhase.DISCOVER)}
                      onChange={() => handleHeaderCheckboxChange(VillagePhase.DISCOVER)}
                    />
                    Phase 1
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={Object.values(villagePhases).every(phase => phase === VillagePhase.EXCHANGE)}
                      onChange={() => handleHeaderCheckboxChange(VillagePhase.EXCHANGE)}
                    />
                    Phase 2
                  </TableCell>
                  <TableCell align="center">
                   <Checkbox
                      checked={Object.values(villagePhases).every(phase => phase === VillagePhase.IMAGINE)}
                      onChange={() => handleHeaderCheckboxChange(VillagePhase.IMAGINE)}
                    />
                    Phase 3
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {villages.data.map((village: Village) => (
              <TableRow key={village.id}>
                <TableCell component="th" scope="row">
                  {village.name}
                </TableCell>
                {[1, 2, 3].map(phase => (
                  <TableCell align="center" key={phase}>
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
