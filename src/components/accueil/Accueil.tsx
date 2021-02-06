import React from 'react';

import { Base } from 'src/components/Base';
import { Filters, FilterArgs } from 'src/components/accueil/Filters';
import { RightNavigation } from 'src/components/accueil/RightNavigation';
import { SubHeader } from 'src/components/accueil/SubHeader';
import { VillageContext } from 'src/contexts/villageContext';

import { Activities } from '../activities/List';

export const Accueil: React.FC = () => {
  const { village } = React.useContext(VillageContext);
  const [filters, setFilters] = React.useState<FilterArgs>({
    type: 0,
    status: 0,
    countries: {},
    pelico: true,
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
      <Activities filters={filters} />
    </Base>
  );
};
