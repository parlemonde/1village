import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MaterialLink from '@mui/material/Link';
import { Button, TextField } from '@mui/material';

import { AdminTile } from 'src/components/admin/AdminTile';
import { CountrySelector } from 'src/components/selectors/CountrySelector';
import { UserContext } from 'src/contexts/userContext';
import { useVillageRequests } from 'src/services/useVillages';
import { defaultOutlinedButtonStyle } from 'src/styles/variables.const';
import { getQueryString } from 'src/utils';
import type { Village } from 'types/village.type';

const EditVillage = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { editVillage } = useVillageRequests();
  const villageId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) || 0, [router]);
  const [village, setVillage] = React.useState<Village | null>(null);

  const getVillage = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/villages/${villageId}`,
    });
    if (response.error) {
      router.push('/admin/villages');
    } else {
      setVillage(response.data);
    }
  }, [axiosLoggedRequest, router, villageId]);

  React.useEffect(() => {
    getVillage().catch((e) => console.error(e));
  }, [getVillage]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!village.name || !village.countries[0] || !village.countries[1]) {
      return;
    }
    const result = await editVillage(village);
    if (result !== null) {
      router.push('/admin/villages');
    }
  };

  if (village === null) {
    return <div></div>;
  }

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/villages" passHref>
          <MaterialLink href="/admin/villages">
            <h1>Villages</h1>
          </MaterialLink>
        </Link>
        <h1>{village.name}</h1>
      </Breadcrumbs>
      <AdminTile title="Modifier un village">
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
            label="Pays 2"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
            <Button color="primary" variant="contained" type="submit">
              Mettre à jour le village
            </Button>
          </div>
        </form>
      </AdminTile>
      <Link href="/admin/villages" passHref>
        <Button color="inherit" variant="outlined" sx={defaultOutlinedButtonStyle} style={{ margin: '1rem 0' }} component="a" href="/admin/villages">
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default EditVillage;
