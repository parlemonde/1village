import React from 'react';

import { Base } from 'src/components/Base';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Filters } from 'src/components/accueil/Filters';
import { RightNavigation } from 'src/components/accueil/RightNavigation';
import { SubHeader } from 'src/components/accueil/SubHeader';
import { Activities } from 'src/components/activities/List';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';

export const Accueil = () => {
  const { village } = React.useContext(VillageContext);
  const [filters, setFilters] = React.useState<FilterArgs>({
    type: 0,
    status: 0,
    countries: {},
    pelico: true,
  });
  const { activities } = useActivities({
    limit: 50,
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.type - 1,
  });

  if (village === null) {
    return (
      <Base subHeader={<SubHeader />} rightNav={<RightNavigation />}>
        <h1>Dernières activités</h1>
      </Base>
    );
  }

  return (
    <Base subHeader={<SubHeader />} rightNav={<RightNavigation />}>
      <h1>Dernières activités</h1>
      <Filters countries={village.countries} filters={filters} onChange={setFilters} />
      <Activities activities={activities} withLinks />
    </Base>
  );
};
