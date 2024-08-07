import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useQueryClient } from 'react-query';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Button } from '@mui/material';
import MaterialLink from '@mui/material/Link';

import { AdminTile } from 'src/components/admin/AdminTile';
import { H5pEditor } from 'src/components/h5p';

const H5pNewContentPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/newportal/h5p" passHref>
          <MaterialLink>
            <h1>Contenu H5P</h1>
          </MaterialLink>
        </Link>
        <h1>Nouveau</h1>
      </Breadcrumbs>
      <AdminTile title="Ajouter un contenu H5P">
        <div style={{ width: '100%' /* display: 'flex', flexDirection: 'column', alignItems: 'center' */ }}>
          <H5pEditor
            onSave={() => {
              enqueueSnackbar('Contenu H5P créé avec succès!', {
                variant: 'success',
              });
              queryClient.invalidateQueries('h5p');
              router.push(`/admin/newportal/h5p`);
            }}
            onError={(message) => {
              enqueueSnackbar(message, {
                variant: 'error',
              });
            }}
          ></H5pEditor>
        </div>
      </AdminTile>
      <Link href="/admin/newportal/h5p" passHref>
        <Button variant="outlined" style={{ margin: '1rem 0' }} component="a">
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default H5pNewContentPage;
