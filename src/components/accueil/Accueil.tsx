import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Filters } from 'src/components/accueil/Filters';
import { Activities } from 'src/components/activities/List';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';
import { getLocalTempHour } from 'src/utils/getLocalTempHour';
import { UserType } from 'types/user.type';

const phaseActivities = [
  [
    { key: 0, label: 'Toutes', type: [3, 5, 6, 7] },
    { key: 1, label: 'Indices culturels', type: [6] },
    { key: 2, label: 'Symboles', type: [7] },
    { key: 3, label: 'Questions', type: [3] },
  ],
  [
    { key: 0, label: 'Toutes', type: [1, 2, 4, 5] },
    { key: 1, label: 'Énigmes', type: [1] },
    { key: 2, label: 'Défis', type: [2] },
    // { key: 10, label: 'Reportage', type: [9] },
    { key: 3, label: 'Jeux', type: [4] },
  ],
  [
    { key: 0, label: 'Toutes', type: [5, 10] },
    { key: 1, label: 'Hymne', type: [10] },
  ],
];

export const Accueil = () => {
  const { village, selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const isModerateur = user !== null && user.type >= UserType.MEDIATOR;
  const [filters, setFilters] = React.useState<FilterArgs>({
    type: [],
    status: 0,
    countries: {},
    pelico: true,
  });
  const [localTemp, setLocalTemp] = React.useState(0);
  const [localTime, setLocalTime] = React.useState();
  const [countries, setCountries] = React.useState<string[]>([]);

  React.useEffect(() => {
    setCountries(selectedPhase !== 1 || isModerateur ? village?.countries : [user.countryCode.toUpperCase()]);
    selectedPhase &&
      setFilters((currFilters: FilterArgs) => ({
        type: phaseActivities[selectedPhase - 1][0].type,
        status: 0,
        countries: currFilters.countries,
        pelico: true,
      }));
    const asyncFunc = async () => {
      if (user && !localTime && !localTemp) {
        const { time, temp } = await getLocalTempHour(user);
        setLocalTemp(temp);
        setLocalTime(time);
      }
    };
    asyncFunc();
  }, [user, selectedPhase]);

  const { activities } = useActivities({
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.type,
  });

  const PhaseAccueil = () => (
    <>
      <h1 style={{ margin: '1rem' }}>
        {' '}
        Un peu de patience, la phase {selectedPhase} n&apos;a pas encore débuté !
        {selectedPhase === 2
          ? ' Rendez-vous ici une fois que vous aurez fait découvrir et découvert où habitaient vos Pélicopains. Vous pourrez alors échanger ensemble !'
          : ' Rendez-vous ici une fois que vous aurez échangé avec vos Pélicopains. Vous pourrez ensuite imaginer ensemble votre village-idéal !'}
      </h1>
      <PelicoReflechit style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
      <Button
        onClick={() => setSelectedPhase(village?.activePhase)}
        color="primary"
        variant="outlined"
        className="navigation__button"
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }}
      >
        Retourner à l&apos;accueil de la phase {village && village?.activePhase}
      </Button>
    </>
  );

  return village && activities ? (
    <Base>
      {selectedPhase <= village?.activePhase ? (
        <>
          {' '}
          <h1>Dernières activités</h1>
          <Filters countries={countries} filters={filters} onChange={setFilters} phase={selectedPhase} phaseActivities={phaseActivities} />
          <p>Température : {Math.floor(localTemp)}°C</p>
          <p>{localTime}</p>
          <Activities activities={activities} withLinks />{' '}
        </>
      ) : (
        <PhaseAccueil />
      )}
    </Base>
  ) : (
    <Base>
      <h1>Dernières activités</h1>
    </Base>
  );
};
