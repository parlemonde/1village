import React from 'react';

import { Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { WorldMap } from 'src/components/WorldMap';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Filters } from 'src/components/accueil/Filters';
import { Activities } from 'src/components/activities/List';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';
import type { Activity, AnyData } from 'types/activity.type';
import { UserType } from 'types/user.type';

export const Accueil = () => {
  const { village, selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const isModerateur = user !== null && user.type >= UserType.MEDIATOR;
  const filterCountries = React.useMemo(
    () =>
      !village || (selectedPhase === 1 && !isModerateur)
        ? user
          ? [user.country.isoCode.toUpperCase()]
          : []
        : village.countries.map((c) => c.isoCode),
    [selectedPhase, village, user, isModerateur],
  );
  const [filters, setFilters] = React.useState<FilterArgs>({
    selectedType: 0,
    types: 'all',
    status: 0,
    countries: filterCountries.reduce<{ [key: string]: boolean }>((acc, c) => {
      acc[c] = true;
      return acc;
    }, {}),
    pelico: true,
  });

  const [activitiesFiltered, setActivitiesFiltered] = React.useState<Activity<AnyData>[]>([]);

  const { activities } = useActivities({
    limit: 200,
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.types === 'all' ? undefined : filters.types,
    phase: selectedPhase,
  });

  function filterActivitiesWithLastMimicGame(activitiesData: Activity<AnyData>[]): Activity<AnyData>[] {
    const mostRecentMimic = activitiesData.find((activity) => activity.subType === 0); // Get the last mimic created
    const indexOfLastMimic = activitiesData.findIndex((activity) => activity.subType === 0); // Get the index of this last mimic
    const activitiesWithoutMimic = activitiesData.filter((activity) => activity.subType !== 0); // Remove all mimics in activities
    const activitiesWithLastMimic = [...activitiesWithoutMimic];
    activitiesWithLastMimic.splice(indexOfLastMimic, 0, mostRecentMimic as unknown as Activity<AnyData>); // Put the last mimic created at the same spot in the array

    return activitiesWithLastMimic;
  }

  // on selected phase change, select all activities.
  React.useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      selectedType: 0,
      types: 'all',
    }));
  }, [selectedPhase]);

  //Preload of the activities filtered only one mimic
  React.useEffect(() => {
    if (activities && activities.length > 0) {
      const filteredActivities = filterActivitiesWithLastMimicGame(activities);
      setActivitiesFiltered(filteredActivities);
    }
  }, [activities]);

  if (!village) {
    return <Base showSubHeader></Base>;
  }

  return (
    <Base showSubHeader>
      {selectedPhase <= village.activePhase && activitiesFiltered && activitiesFiltered.length > 0 ? (
        <>
          <KeepRatio ratio={1 / 3}>
            <WorldMap />
          </KeepRatio>{' '}
          <h1 style={{ marginTop: '1rem' }}>Dernières activités</h1>
          <Filters countries={filterCountries} filters={filters} onChange={setFilters} phase={selectedPhase} />
          <Activities activities={activitiesFiltered} withLinks />
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem', alignItems: 'center' }}>
          <h1 style={{ margin: '1rem' }}>
            Un peu de patience, la phase {selectedPhase} n&apos;a pas encore débuté !
            {selectedPhase === 2
              ? ' Rendez-vous ici une fois que vous aurez fait découvrir et découvert où habitent vos Pélicopains. Vous pourrez alors échanger ensemble !'
              : ' Rendez-vous ici une fois que vous aurez échangé avec vos Pélicopains. Vous pourrez ensuite imaginer ensemble votre village-idéal !'}
          </h1>
          <PelicoReflechit style={{ width: '50%', height: 'auto', maxWidth: '360px' }} />
          <Button
            onClick={() => setSelectedPhase(village.activePhase)}
            color="primary"
            variant="outlined"
            className="navigation__button"
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }}
          >
            Retourner à l&apos;accueil de la phase {village && village.activePhase}
          </Button>
        </div>
      )}
    </Base>
  );
};
