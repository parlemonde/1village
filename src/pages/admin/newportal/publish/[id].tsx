import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { Button, CircularProgress, InputLabel, MenuItem, Select, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

import { useGetActivityById } from 'src/api/activities/activities.get';
import { publishActivity } from 'src/api/activities/activities.put';
import { useGetVillages } from 'src/api/villages/villages.get';
import BackArrow from 'src/svg/back-arrow.svg';

export default function ActivityTopublish() {
  const [phase, setPhase] = useState(1);
  const [villagesSelected, setVillagesSelected] = useState<{ [villageName: string]: boolean }>({});
  const [countries, setCountries] = useState<Array<{ isoCode: string; name: string }>>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const checkSelectVillages = useCallback(() => {
    return !Object.keys(villagesSelected).some((key) => {
      return villagesSelected[key] === true;
    });
  }, [villagesSelected]);

  const mutation = useMutation({
    mutationFn: (activityId: number) => {
      return publishActivity({ activityId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const villages = useGetVillages();
  const activity = useGetActivityById({ id: Number(router.query.id) });
  useEffect(() => {
    if (activity.data) {
      setPhase(activity.data.phase);
    }
    if (villages.data) {
      villages.data.forEach((v) => {
        setVillagesSelected((state) => ({ ...state, [v.name]: false }));
        setCountries((state) => [...new Set([...state, ...v.countries])]);
      });
      setVillagesSelected((state) => ({ ...state, all: false }));
    }
  }, [activity.data, villages.data]);

  if (activity.isError || villages.isError) return <p>Bad request</p>;
  if (activity.isLoading || activity.isIdle || villages.isLoading || villages.isIdle) return <p>loading...</p>;

  const title: string = activity.data.data?.title ? (activity.data.data.title as string) : '[No title]';
  const handleVillageChange = (villageName: string) => {
    const newValue = !villagesSelected[villageName];
    if (villageName === 'all') {
      setVillagesSelected((state) => ({
        ...state,
        all: newValue,
      }));

      Object.keys(villagesSelected).forEach((key) => {
        setVillagesSelected((state) => ({
          ...state,
          [key]: newValue,
        }));
      });
    } else {
      setVillagesSelected((state) => ({
        ...state,
        [villageName]: !villagesSelected[villageName],
      }));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Link href="/admin/newportal/publish">
          <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
            <BackArrow />
            <h1 style={{ marginLeft: 10 }}>{title}</h1>
          </div>
        </Link>
        <Button
          size="small"
          sx={{ border: 1 }}
          onClick={() => mutation.mutate(activity.data.id)}
          disabled={mutation.isLoading || checkSelectVillages()}
        >
          {mutation.isLoading ? <CircularProgress size={20} /> : 'Publier'}
        </Button>
      </div>
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner la phase:</h3>
        <div style={{ display: 'flex', height: 20, width: 180, justifyContent: 'space-around' }}>
          <InputLabel id="phase-selecto">Phase</InputLabel>
          <Select sx={{ width: 120 }} labelId="phase-selecto" value={phase} label="Phase" onChange={(e) => setPhase(Number(e.target.value))}>
            <MenuItem value={1}>Phase 1</MenuItem>
            <MenuItem value={2}>Phase 2</MenuItem>
            <MenuItem value={3}>Phase 3</MenuItem>
          </Select>
        </div>
      </div>
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner le/les villages concerné.s par la publication:</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            sx={{
              marginTop: 2,
              marginBottom: 2,
              fontWeight: 900,
            }}
            key={'all'}
            control={<Checkbox checked={villagesSelected['all']} onChange={() => handleVillageChange('all')} />}
            label={'Villages - mondes'}
          />
          {villages.data.map((village) => (
            <FormControlLabel
              key={`${village.id}-${village.name}`}
              control={<Checkbox checked={villagesSelected[village.name]} onChange={() => handleVillageChange(village.name)} />}
              label={village.name}
            />
          ))}
          {checkSelectVillages() && <FormHelperText error={checkSelectVillages()}>Au moins un village doit etre selectionné</FormHelperText>}
        </div>
      </div>
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner le/les pays concerné.s par la publication:</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            sx={{
              marginTop: 2,
              marginBottom: 2,
              fontWeight: 900,
            }}
            key={'all'}
            control={<Checkbox checked={villagesSelected['all']} onChange={() => handleVillageChange('all')} />}
            label={'Pays'}
          />
          {countries.map((country) => (
            <FormControlLabel key={country.isoCode} control={<Checkbox onChange={() => handleVillageChange(country.name)} />} label={country.name} />
          ))}
          {checkSelectVillages() && <FormHelperText error={checkSelectVillages()}>Au moins un village doit etre selectionné</FormHelperText>}
        </div>
      </div>
    </div>
  );
}
