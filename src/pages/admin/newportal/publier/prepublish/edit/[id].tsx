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

import { deleteActivity } from 'src/api/activities/activities.admin.delete';
import { postAdminActivity } from 'src/api/activities/activities.admin.post';
import { useUpdateActivityPhase } from 'src/api/activities/activities.admin.put';
import { useGetChildrenActivitiesById } from 'src/api/activities/activities.adminGetChildren';
import { useGetOneActivityById } from 'src/api/activities/activities.getOneById';
import { useGetVillages } from 'src/api/villages/villages.get';
import { UserContext } from 'src/contexts/userContext';
import type { Activity } from 'types/activity.type';
import { UserType } from 'types/user.type';

const ModifPrepublish = () => {
  const { user } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;

  const [selectedPhase, setSelectedPhase] = React.useState('1');
  const [selectedVillages, setSelectedVillages] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [publishedVillageIds, setPublishedVillageIds] = React.useState<number[]>([]);

  const { data: activityParent } = useGetOneActivityById({ id: Number(id) });
  const { data: villages } = useGetVillages();
  const { data: childrenActivities } = useGetChildrenActivitiesById({ id: Number(id) });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { mutateAsync: updatePhase } = useUpdateActivityPhase({ activityId: Number(id), phase: Number(selectedPhase) });
  useEffect(() => {
    if (childrenActivities) {
      const publishedVillageIds = childrenActivities.map((activity: Activity) => activity.villageId);
      setSelectedVillages(publishedVillageIds);
    }
  }, [childrenActivities]);

  useEffect(() => {
    if (childrenActivities?.length) {
      const publishedVillageIds = childrenActivities.map((activity: Activity) => activity.villageId);
      setSelectedVillages(publishedVillageIds);

      const initialPhase = childrenActivities[0].phase;
      setSelectedPhase(String(initialPhase));
    }
  }, [childrenActivities]);

  useEffect(() => {
    if (childrenActivities?.length) {
      const villageIds = childrenActivities.map((activity: Activity) => activity.villageId);
      setPublishedVillageIds(villageIds); // Stocker les villages publiés
      setSelectedVillages(villageIds); // Initialiser avec les villages déjà publiés
      setSelectedPhase(String(childrenActivities[0].phase)); // Phase initiale
    }
  }, [childrenActivities]);

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
    if (activityParent.type === 11) {
      try {
        setIsLoading(true);
        const villagesToAdd = selectedVillages.filter((villageId) => !publishedVillageIds.includes(villageId));
        const villagesToDelete = publishedVillageIds.filter((villageId) => !selectedVillages.includes(villageId));

        if (Number(selectedPhase) !== childrenActivities[0].phase) {
          await Promise.all(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            childrenActivities.map(async (activity) => {
              await updatePhase({ activityId: activity.id, phase: Number(selectedPhase) });
            }),
          );
          await updatePhase({ activityId: activityParent.id, phase: Number(selectedPhase) });

          enqueueSnackbar('Phase mise à jour avec succès', { variant: 'success' });
        }

        if (villagesToAdd.length > 0) {
          await postAdminActivity({ activityParentId: Number(id), phase: Number(selectedPhase), villages: villagesToAdd });
          enqueueSnackbar('Hymnes publiés avec succès', { variant: 'success' });
        }

        if (villagesToDelete.length > 0) {
          await Promise.all(
            childrenActivities
              .filter((activity: { villageId: number }) => villagesToDelete.includes(activity.villageId))
              .map(async (activity: { id: number }) => {
                // eslint-disable-next-line
                // @ts-ignore
                await deleteActivity(activity.id);
              }),
          );
          enqueueSnackbar('Hymnes supprimés avec succès', { variant: 'success' });
        }

        await queryClient.invalidateQueries({ queryKey: ['activityById', 'activities'] });

        setTimeout(() => {
          setIsLoading(false);
          window.location.assign('/admin/newportal/publier');
        }, 1000);
      } catch (error) {
        enqueueSnackbar('Une erreur est survenue lors de la modification', { variant: 'error' });
      }
    } else {
      try {
        setIsLoading(true);
        const villagesToAdd = selectedVillages.filter((villageId) => !publishedVillageIds.includes(villageId));
        const villagesToDelete = publishedVillageIds.filter((villageId) => !selectedVillages.includes(villageId));

        if (childrenActivities.length > 0 && Number(selectedPhase) !== childrenActivities[0].phase) {
          await Promise.all(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            childrenActivities.map(async (activity) => {
              await updatePhase({ activityId: activity.id, phase: Number(selectedPhase) });
            }),
          );
          await updatePhase({ activityId: activityParent.id, phase: Number(selectedPhase) });

          enqueueSnackbar('Phase mise à jour avec succès', { variant: 'success' });
        }

        if (villagesToAdd.length > 0) {
          await postAdminActivity({ activityParentId: Number(id), phase: Number(selectedPhase), villages: villagesToAdd });
          enqueueSnackbar('Activités publiées avec succès', { variant: 'success' });
        }

        if (villagesToDelete.length > 0) {
          await Promise.all(
            childrenActivities
              .filter((activity: { villageId: number }) => villagesToDelete.includes(activity.villageId))
              .map(async (activity: { id: number }) => {
                await deleteActivity(activity.id);
              }),
          );
          enqueueSnackbar('Activités supprimées avec succès', { variant: 'success' });
        }

        await queryClient.invalidateQueries({ queryKey: ['activityById', 'activities'] });

        setTimeout(() => {
          setIsLoading(false);
          window.location.assign('/admin/newportal/publier');
        }, 1000);
      } catch (error) {
        enqueueSnackbar('Une erreur est survenue lors de la modification', { variant: 'error' });
      }
    }
  };

  const isModificationDisabled = () => {
    if (isLoading) return true;

    const hasPublishedVillages = publishedVillageIds.length > 0;
    const hasSelectedVillages = selectedVillages.length > 0;

    const areVillagesTheSame =
      publishedVillageIds.length === selectedVillages.length && publishedVillageIds.every((id: number) => selectedVillages.includes(id));

    const phaseChanged = childrenActivities.length > 0 && childrenActivities[0]?.phase !== Number(selectedPhase);

    const noChangesMade = areVillagesTheSame && !phaseChanged;

    return (!hasSelectedVillages && !hasPublishedVillages) || noChangesMade;
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
          <Button variant="contained" color="primary" onClick={handlePublish} disabled={isModificationDisabled()}>
            Modifier
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

export default ModifPrepublish;
