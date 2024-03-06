import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useQueryClient } from 'react-query';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Button } from '@mui/material';
import MaterialLink from '@mui/material/Link';

import { useH5pContentList } from 'src/api/h5p/h5p-content.list';
import { AdminTile } from 'src/components/admin/AdminTile';
import { H5pEditor } from 'src/components/h5p';
import { getQueryString } from 'src/utils';

const H5pEditContentPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: h5pContent } = useH5pContentList();
  const { enqueueSnackbar } = useSnackbar();

  const contentId = React.useMemo(() => getQueryString(router.query.id), [router]);
  const content = (h5pContent || []).find((h5p) => h5p.contentId === contentId);

  if (h5pContent && !content) {
    router.push(`/admin/h5p`);
  }
  if (!content) {
    return null;
  }

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/h5p" passHref>
          <MaterialLink>
            <h1>Contenu H5P</h1>
          </MaterialLink>
        </Link>
        <h1>{content.title}</h1>
      </Breadcrumbs>
      <AdminTile title="Ajouter un contenu H5P">
        <div style={{ width: '100%' /* display: 'flex', flexDirection: 'column', alignItems: 'center' */ }}>
          <H5pEditor
            contentId={content.contentId}
            onSave={() => {
              enqueueSnackbar('Contenu H5P modifié avec succès!', {
                variant: 'success',
              });
              queryClient.invalidateQueries('h5p');
              router.push(`/admin/h5p`);
            }}
            onError={(message) => {
              enqueueSnackbar(message, {
                variant: 'error',
              });
            }}
          ></H5pEditor>
        </div>
      </AdminTile>
      <Link href="/admin/h5p" passHref>
        <Button variant="outlined" style={{ margin: '1rem 0' }} component="a">
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default H5pEditContentPage;
