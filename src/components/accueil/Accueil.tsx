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

export const Accueil = () => {
  const { village, selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const [filters, setFilters] = React.useState<FilterArgs>({
    type: 0,
    status: 0,
    countries: {},
    pelico: true,
  });
  const [localTemp, setLocalTemp] = React.useState(0);
  const [localTime, setLocalTime] = React.useState();

  React.useEffect(() => {
    const asyncFunc = async () => {
      if (user) {
        const { time, temp } = await getLocalTempHour(user);
        setLocalTemp(temp);
        setLocalTime(time);
      }
    };
    asyncFunc();
  }, [user]);

  const { activities } = useActivities({
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.type - 1,
  });

  const PhaseAccueil = () => (
    <>
      <h1 style={{ margin: '1rem' }}>
        {' '}
        Un peu de patience, la phase {selectedPhase} n'a pas encore débuté !
        {selectedPhase === 2
          ? ' Rendez-vous ici une fois que vous aurez fait découvrir et découvert où habitaient vos Pélicopains. Vous pourrez alors échanger ensemble !'
          : ' Rendez-vous ici une fois que vous aurez échangé avec vos Pélicopains. Vous pourrez ensuite imaginer ensemble votre village-idéal !'}
      </h1>
      <PelicoReflechit style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
      <Button
        onClick={() => setSelectedPhase(selectedPhase - 1)}
        color="primary"
        variant="outlined"
        className="navigation__button"
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }}
      >
        Retourner à l'accueil de la phase {village && village?.activePhase}
      </Button>
    </>
  );

  return village ? (
    <Base>
      {selectedPhase <= village.activePhase ? (
        <>
          {' '}
          <h1>Dernières activités</h1>
          <Filters countries={village.countries} filters={filters} onChange={setFilters} />
          <p>Température : {Math.floor(localTemp)}°</p>
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
