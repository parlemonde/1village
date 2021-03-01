import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import MaterialLink from '@material-ui/core/Link';
import { Button, TextField } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { AdminTile } from 'src/components/admin/AdminTile';
import { CountrySelector } from 'src/components/selectors/CountrySelector';
import { useVillageRequests } from 'src/services/useVillages';

const NewVillage: React.FC = () => {
  const router = useRouter();
  const { addVillage } = useVillageRequests();

  const [village, setVillage] = React.useState<{ name: string; countries: string[] }>({
    name: '',
    countries: ['', ''],
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!village.name || !village.countries[0] || !village.countries[1]) {
      return;
    }
    const result = await addVillage(village);
    if (result !== null) {
      router.push('/admin/villages');
    }
  };

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/villages">
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
            value={village.countries[0]}
            onChange={(newValue: string) => {
              setVillage((v) => ({ ...v, countries: [newValue, village.countries[1]] }));
            }}
            label="Pays 1"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <CountrySelector
            value={village.countries[1]}
            onChange={(newValue: string) => {
              setVillage((v) => ({ ...v, countries: [village.countries[0], newValue] }));
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
      <Link href="/admin/villages">
        <Button variant="outlined" style={{ margin: '1rem 0' }} component="a" href="/admin/villages">
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default NewVillage;
