import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import { postAdminActivity } from 'src/api/activities/activities.admin.post';
import { useGetOneActivityById } from 'src/api/activities/activities.getOneById';
import { useGetVillages } from 'src/api/villages/villages.get';
import { UserContext } from 'src/contexts/userContext';
import { UserType } from 'types/user.type';

const Prepublier = () => {
  const { user } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;

  const [selectedPhase, setSelectedPhase] = React.useState('1');
  const [selectedVillages, setSelectedVillages] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: activityParent } = useGetOneActivityById({ id: Number(id) });
  const { data: villages } = useGetVillages();

  useEffect(() => {
    if (user?.type === UserType.OBSERVATOR) {
      router.push('/admin/newportal/analyze');
    }
  }, [router, user]);

  const handleChange = (event: SelectChangeEvent) => {
    const phase = event.target.value as string;
    setSelectedPhase(phase);
  };

  const handleCheckboxChange = (villageId: number) => {
    setSelectedVillages((prevSelectedVillages) => {
      if (prevSelectedVillages.includes(villageId)) {
        return prevSelectedVillages.filter((id) => id !== villageId);
      } else {
        return [...prevSelectedVillages, villageId];
      }
    });
  };

  if (!activityParent && !villages) {
    return (
      <>
        <Box sx={{ maxWidth: '80vw', margin: '0' }}>
          <Skeleton variant="text" height={50} />
          <Skeleton variant="rounded" height={150} />
          <Skeleton variant="text" height={50} />
          <Skeleton variant="rounded" height={400} />
        </Box>
      </>
    );
  }

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      const response = await postAdminActivity({ activityParentId: Number(id), phase: Number(selectedPhase), villages: selectedVillages });
      enqueueSnackbar(response.message, {
        variant: 'success',
      });
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setTimeout(() => {
        router.push('/admin/newportal/publier');
      }, 1000);
    } catch (error) {
      enqueueSnackbar('Une erreur est survenue', {
        variant: 'error',
      });
    }
    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80vw' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
          <Link href="/admin/newportal/publier" style={{ marginRight: '8px' }}>
            <ChevronLeftIcon />
          </Link>
          <h1>{activityParent?.data?.title}</h1>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={handlePublish} disabled={isLoading || selectedVillages.length < 1}>
            Publier
            {isLoading && (
              <Box sx={{ display: 'flex', paddingLeft: '1rem' }}>
                <CircularProgress size="1rem" />
              </Box>
            )}
          </Button>
        </div>
      </div>
      <Box sx={{ minWidth: 150, maxWidth: 200 }}>
        <h2 style={{ paddingBottom: '10px' }}>Sélectionner la phase :</h2>
        <FormControl fullWidth size="small">
          <InputLabel id="phase-menu-select">Phase</InputLabel>
          <Select labelId="phase-menu-select" id="phase-menu" value={selectedPhase} label="Phase" onChange={handleChange}>
            <MenuItem value={1}>Phase 1</MenuItem>
            <MenuItem value={2}>Phase 2</MenuItem>
            <MenuItem value={3}>Phase 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <h2 style={{ paddingTop: '20px' }}>Sélectionner le ou les Village-Monde concerné.s par la publication </h2>
      <Box sx={{ maxWidth: '80vw' }}>
        {villages?.map((village) => (
          <Box key={village.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              style={{ marginRight: '8px' }}
              checked={selectedVillages.includes(village.id)}
              onChange={() => handleCheckboxChange(village.id)}
            />{' '}
            <p style={{ borderBottom: '0.5px solid grey', maxWidth: '80vw', width: '100%', margin: '0' }}>{village.name}</p>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Prepublier;
