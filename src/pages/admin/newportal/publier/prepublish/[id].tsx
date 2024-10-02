import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import { useGetOneActivityById } from 'src/api/activities/activities.getOneById';
import { UserContext } from 'src/contexts/userContext';
import { UserType } from 'types/user.type';

const Prepublier = () => {
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const [phase, setPhase] = React.useState('1');

  const { id } = router.query;
  const activity = useGetOneActivityById({ id: Number(id) });

  console.log(activity);

  useEffect(() => {
    if (user?.type === UserType.OBSERVATOR) {
      router.push('/admin/newportal/analyze');
    }
  }, [router, user]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedPhase = event.target.value as string;
    setPhase(selectedPhase);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '60vw' }}>
      <h1>{activity?.data?.data?.title}</h1>
      <Box sx={{ minWidth: 150, maxWidth: 200 }}>
        <h2 style={{ paddingBottom: '10px' }}>Sélectionner la phase :</h2>
        <FormControl fullWidth size="small">
          <InputLabel id="phase-menu-select">Phase</InputLabel>
          <Select labelId="phase-menu-select" id="phase-menu" value={phase} label="Phase" onChange={handleChange}>
            <MenuItem value={1}>Phase 1</MenuItem>
            <MenuItem value={2}>Phase 2</MenuItem>
            <MenuItem value={3}>Phase 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <h2 style={{ paddingTop: '20px' }}>Sélectionner le ou les Village-Monde concerné.s par la publication </h2>

      <p>{id}</p>
    </div>
  );
};

export default Prepublier;
