import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { Button, CircularProgress, InputLabel, MenuItem, Select, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

import { useGetActivityById } from 'src/api/activities/activities.get';
import { publishActivity } from 'src/api/activities/activities.put';
import { useGetVillages } from 'src/api/villages/villages.get';
import BackArrow from 'src/svg/back-arrow.svg';
import { turnPhaseStepEnumIntoLitteral, mapPhaseStepEnum } from 'src/utils/activity';
import type { EPhase1Steps, EPhase2Steps, EPhase3Steps } from 'types/activity.type';
import type { Country } from 'types/country.type';

type VillageState = { id: number; name: string; selected: boolean };
type CountryState = Country & { villageId: number[]; selected: boolean; disabled: boolean };
type PhaseStep = { checked: boolean; key: string; name: string };

export default function ActivityTopublish() {
  const ALL_VILLAGES = 'all-villages';
  const ALL_COUNTRIES = 'all-countries';
  const [phase, setPhase] = useState(1);
  const [villagesSelected, setVillagesSelected] = useState<VillageState[]>([{ id: 0, name: ALL_VILLAGES, selected: false }]);
  const [countries, setCountries] = useState<CountryState[]>([]);
  const [phaseSteps, setPhaseSteps] = useState<PhaseStep[]>(
    mapPhaseStepEnum(phase).map((e) => ({
      checked: false,
      key: e,
      name: turnPhaseStepEnumIntoLitteral(e as EPhase1Steps | EPhase2Steps | EPhase3Steps),
    })),
  );
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const checkSelectedVillages = useCallback(() => {
    if (villagesSelected.length) {
      return !villagesSelected.some((village) => village.selected);
    }
    return;
  }, [villagesSelected]);

  const checkSelectedCountries = useCallback(() => {
    if (countries.length) {
      return !countries.some((country) => country.selected && !country.disabled);
    }
    return;
  }, [countries]);

  const getVillageValues = useCallback(
    (villageName: string) => {
      if (villagesSelected.length) {
        return villagesSelected.find((village) => village.name === villageName);
      }
      return;
    },
    [villagesSelected],
  );

  // const getcountryValues = useCallback(
  //   (countryIsoCode: string) => {
  //     if (countries.length) {
  //       return countries.find((country) => country.isoCode === countryIsoCode);
  //     }
  //     return;
  //   },
  //   [countries],
  // );

  useEffect(() => {
    if (activity.data) {
      setPhase(activity.data.phase);
    }
    if (villages.data) {
      const countriesToSet: CountryState[] = [];
      villages.data.forEach((village) => {
        setVillagesSelected((state) => [...state, { id: village.id, name: village.name, selected: false }]);
        village.countries.forEach((country) => {
          const foundIso = countriesToSet.find((c) => c.isoCode === country.isoCode);
          if (foundIso) {
            foundIso.villageId.push(village.id);
          } else {
            countriesToSet.push({ ...country, villageId: [village.id], selected: false, disabled: true });
          }
        });
        setCountries([{ isoCode: ALL_COUNTRIES, name: ALL_COUNTRIES, selected: false, disabled: false, villageId: [] }, ...countriesToSet]);
      });
    }
  }, [activity.data, villages.data]);

  if (activity.isError || villages.isError) return <p>Bad request</p>;
  if (activity.isLoading || activity.isIdle || villages.isLoading || villages.isIdle) return <p>loading...</p>;

  const title: string = activity.data.data?.title ? (activity.data.data.title as string) : '[No title]';

  const handleVillageChange = (villageId: number, villageName: string) => {
    const newValueSelected = !villagesSelected.find((village) => village.name === villageName)?.selected;
    if (villageName === ALL_VILLAGES) {
      setVillagesSelected((state) => state.map((e) => ({ ...e, selected: newValueSelected })));
      setCountries((state) => state.map((country) => ({ ...country, disabled: !newValueSelected })));
    } else {
      setVillagesSelected((state) =>
        state.reduce<VillageState[]>((acc, village) => {
          if (village.name === villageName) {
            acc.push({ ...village, selected: newValueSelected });
          } else {
            acc.push(village);
          }
          return acc;
        }, []),
      );
      setCountries((state) =>
        state.reduce<CountryState[]>((acc, country) => {
          if (country.villageId.includes(villageId)) {
            acc.push({ ...country, disabled: !newValueSelected });
          } else {
            acc.push(country);
          }
          return acc;
        }, []),
      );
    }
  };
  const handleStepPhase = (phase: number) => {
    setPhaseSteps(
      mapPhaseStepEnum(phase).map((e) => ({
        checked: false,
        key: e,
        name: turnPhaseStepEnumIntoLitteral(e as EPhase1Steps | EPhase2Steps | EPhase3Steps),
      })),
    );
  };
  const handleStepPhaseCheck = (phaseKey: string) => {
    setPhaseSteps((state) =>
      state.reduce<PhaseStep[]>((acc, currStep) => {
        if (currStep.key === phaseKey) {
          acc.push({ ...currStep, checked: !currStep.checked });
        } else {
          acc.push({ ...currStep, checked: false });
        }
        return acc;
      }, []),
    );
  };
  // const handleCountryChange = (countryIsoCode: string) => {
  //   if (countryIsoCode === ALL_COUNTRIES) {
  //     const foundCoutry = countries.find((e) => e.isoCode === ALL_COUNTRIES);

  //     const newValue = !foundCoutry?.selected;

  //     setCountries((state) => {
  //       return state.reduce<CountryState[]>((acc, country) => {
  //         if (!country.disabled) {
  //           acc.push({ ...country, selected: newValue });
  //         } else {
  //           acc.push(country);
  //         }
  //         return acc;
  //       }, []);
  //     });
  //   } else {
  //     setCountries((state) => {
  //       return state.reduce<CountryState[]>((acc, country) => {
  //         if (country.isoCode === countryIsoCode) {
  //           acc.push({ ...country, selected: !country.selected });
  //         } else {
  //           acc.push(country);
  //         }
  //         return acc;
  //       }, []);
  //     });
  //   }
  // };

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
          disabled={mutation.isLoading || checkSelectedVillages() || checkSelectedCountries()}
        >
          {mutation.isLoading ? <CircularProgress size={20} /> : 'Publier'}
        </Button>
      </div>
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner la phase:</h3>
        <div style={{ display: 'flex', height: 20, width: 180, justifyContent: 'space-around' }}>
          <InputLabel id="phase-selecto">Phase</InputLabel>
          <Select
            sx={{ width: 120 }}
            labelId="phase-selecto"
            value={phase}
            label="Phase"
            onChange={(e) => {
              const phaseNumber = Number(e.target.value);
              setPhase(phaseNumber);
              handleStepPhase(phaseNumber);
            }}
          >
            <MenuItem value={1}>Phase 1</MenuItem>
            <MenuItem value={2}>Phase 2</MenuItem>
            <MenuItem value={3}>Phase 3</MenuItem>
          </Select>
        </div>
      </div>
      {/* Villages monde */}
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner le/les villages concerné.s par la publication:</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            sx={{
              marginTop: 2,
              marginBottom: 2,
              fontWeight: 900,
            }}
            key={ALL_VILLAGES}
            control={<Checkbox checked={getVillageValues(ALL_VILLAGES)?.selected} onChange={() => handleVillageChange(0, ALL_VILLAGES)} />}
            label={'Villages - mondes'}
          />
          {villages.data.map((village) => (
            <FormControlLabel
              key={`${village.id}-${village.name}`}
              control={<Checkbox checked={getVillageValues(village.name)?.selected} onChange={() => handleVillageChange(village.id, village.name)} />}
              label={village.name}
            />
          ))}
          <div style={{ height: 10 }}>
            {checkSelectedVillages() && <FormHelperText error={checkSelectedVillages()}>Au moins un village doit etre selectionné</FormHelperText>}
          </div>
        </div>
      </div>
      {/* Pays */}
      {/* <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner le/les pays concerné.s par la publication:</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            sx={{
              marginTop: 2,
              marginBottom: 2,
              fontWeight: 900,
            }}
            key={ALL_COUNTRIES}
            control={<Checkbox checked={getcountryValues(ALL_COUNTRIES)?.selected} onChange={() => handleCountryChange(ALL_COUNTRIES)} />}
            label={'Pays'}
          />
          {countries
            .filter((e) => e.isoCode !== ALL_COUNTRIES && !e.disabled)
            .map((country) => (
              <FormControlLabel
                key={country.isoCode}
                disabled={country.disabled}
                checked={country.selected}
                control={<Checkbox onChange={() => handleCountryChange(country.isoCode)} />}
                label={country.name}
              />
            ))}
        </div>
        <div style={{ height: 10 }}>
          {checkSelectedCountries() && <FormHelperText error={checkSelectedCountries()}>Au moins un pays doit etre selectionné</FormHelperText>}
        </div>
      </div> */}
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ margin: '5px 0' }}>Sélectionner le/les pays concerné.s par la publication:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {phaseSteps.map((ph) => {
            return (
              <FormControlLabel
                key={ph.key}
                checked={ph.checked}
                control={<Checkbox onChange={() => handleStepPhaseCheck(ph.key)} />}
                label={ph.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
