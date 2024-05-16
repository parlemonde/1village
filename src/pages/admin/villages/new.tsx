import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import type { Country } from 'server/entities/country';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button, TextField } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MaterialLink from '@mui/material/Link';

import { AdminTile } from 'src/components/admin/AdminTile';
import { CountrySelector } from 'src/components/selectors/CountrySelector';
import { CountryContext } from 'src/contexts/countryContext';
import { useVillageRequests } from 'src/services/useVillages';

const NewVillage = () => {
  const router = useRouter();
  const { countries } = useContext(CountryContext);
  const { addVillage } = useVillageRequests();

  const [village, setVillage] = React.useState<{ name: string; countries: Country[] }>({
    name: '',
    countries: [],
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!village.name || !village.countries[0] || !village.countries[1]) {
      return;
    }
    const result = await addVillage({ name: village.name, countries: village.countries });
    if (result !== null) {
      router.push('/admin/villages');
    }
  };

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/villages" passHref>
          <MaterialLink href="/admin/villages">
            <h1>Villages</h1>
          </MaterialLink>
        </Link>
        <h1>Nouveau</h1>
      </Breadcrumbs>
      <AdminTile title="Ajouter un village">
        <form autoComplete="off" style={{ width: '100%', padding: '1rem' }} onSubmit={onSubmit}>
          <TextField
            className="full-width"
            variant="standard"
            name="vl-n"
            label="Nom du village"
            autoComplete="new-password"
            value={village.name}
            onChange={(event) => {
              setVillage((v) => ({ ...v, name: event.target.value }));
            }}
            style={{ marginBottom: '1rem' }}
          />
          <CountrySelector
            value={village.countries[0].isoCode}
            onChange={(newValue: string) => {
              const foundCountry = countries.find((c) => c.isoCode === newValue);
              if (foundCountry) setVillage((v) => ({ ...v, countries: [foundCountry, village.countries[1]] }));
            }}
            label="Pays 1"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <CountrySelector
            value={village.countries[1].isoCode}
            onChange={(newValue: string) => {
              const foundCountry = countries.find((c) => c.isoCode === newValue);
              if (foundCountry) setVillage((v) => ({ ...v, countries: [village.countries[0], foundCountry] }));
            }}
            label="Pays 1"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
            <Button color="primary" variant="contained" type="submit">
              Créer le village !
            </Button>
          </div>
        </form>
      </AdminTile>
      <Link href="/admin/villages" passHref>
        <Button variant="outlined" style={{ margin: '1rem 0' }} component="a" href="/admin/villages">
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default NewVillage;
