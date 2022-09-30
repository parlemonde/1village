import React from 'react';

import { Box } from '@mui/material';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimic } from 'src/activity-types/game.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { WorldMap } from 'src/components/WorldMap';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Filters } from 'src/components/accueil/Filters';
import { Activities } from 'src/components/activities/List';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { primaryColor, secondaryColor } from 'src/styles/variables.const';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';
import type { Activity, AnyData } from 'types/activity.type';
import { UserType } from 'types/user.type';

const MaClasse = () => {
  const { village, selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const isMediator = user !== null && user.type >= UserType.MEDIATOR;
  const filterCountries = React.useMemo(
    () =>
      !village || (selectedPhase === 1 && !isMediator) ? (user ? [user.country.isoCode.toUpperCase()] : []) : village.countries.map((c) => c.isoCode),
    [selectedPhase, village, user, isMediator],
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

  const { activities } = useActivities({
    limit: 200,
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.types === 'all' ? undefined : filters.types,
    phase: selectedPhase,
  });

  function filterActivitiesWithLastMimicGame(activitiesData: Activity<AnyData>[]): Activity<AnyData>[] {
    const indexOfLastMimic = activitiesData.findIndex((activity) => isGame(activity) && isMimic(activity)); // Get the index of this last mimic
    if (indexOfLastMimic === -1) {
      return activitiesData;
    }
    const mostRecentMimic = activitiesData[indexOfLastMimic]; // Get the last mimic created
    const activitiesWithoutMimic = activitiesData.filter((activity) => !isGame(activity) || !isMimic(activity)); // Remove all mimics in activities
    const activitiesWithLastMimic = [...activitiesWithoutMimic];
    activitiesWithLastMimic.splice(indexOfLastMimic, 0, mostRecentMimic); // Put the last mimic created at the same spot in the array

    return activitiesWithLastMimic;
  }

  const activitiesFiltered = React.useMemo(() => {
    if (activities && activities.length > 0) {
      return filterActivitiesWithLastMimicGame(activities);
    } else {
      return [];
    }
  }, [activities]);

  return (
    <>
      <Base>
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '10%',
            marginRight: '10%',
            textAlign: 'left',
          }}
        >
          <h1 style={{ marginTop: '0.5rem', color: primaryColor }}>Pélico</h1>
          <img style={{ borderRadius: '25%', borderColor: primaryColor, border: 'solid 2px', margin: '5%' }} src="http://placekitten.com/200/200" />
          <h2>Qui est Pélico ?</h2>
          <p className="text" style={{textAlign: 'justify'}}>
            Pélico est un oiseau curieux et intelligent qui aime apprendre et découvrir de nouvelles choses. Il parcourt le monde pour se faire de
            nouveaux amis.
          </p>
        </Box> */}
        <Box
          sx={{
            marginLeft: '2%',
            marginRight: '2%',
          }}
        >
          <h1 style={{ marginTop: '0.5rem', color: primaryColor }}>Pélico</h1>
          <div id="container" style={{ width: '100%', textAlign: 'justify' }}>
            <div style={{ width: '24%', float: 'right', marginLeft: '3%', marginRight: '1%' }}>
              <img style={{ borderRadius: '25%', borderColor: primaryColor, border: 'solid 2px' }} src="http://placekitten.com/200/200" />
            </div>
            <h2>Qui est Pélico ?</h2>
            <p className="text" style={{ width: '74%', textAlign: 'justify' }}>
              Pélico est un oiseau curieux et intelligent qui aime apprendre et découvrir de nouvelles choses. Il parcourt le monde pour se faire de
              nouveaux amis. Pélico est un oiseau curieux et intelligent qui aime apprendre et découvrir de nouvelles choses. Il parcourt le monde
              pour se faire de nouveaux amis. Pélico est un oiseau curieux et intelligent qui aime apprendre et découvrir de nouvelles choses. Il
              parcourt le monde pour se faire de nouveaux amis.
            </p>
          </div>
          <h2>Que dit Pélico ?</h2>
          <Activities activities={activitiesFiltered} withLinks />
        </Box>
      </Base>
    </>
  );
};

export default MaClasse;
