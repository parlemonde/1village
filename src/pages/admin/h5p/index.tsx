import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useQueryClient } from 'react-query';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, NoSsr, IconButton, Tooltip } from '@mui/material';
import MaterialLink from '@mui/material/Link';

import { useDeleteH5pContentMutation } from 'src/api/h5p/h5p-content.delete';
import { useH5pContentList } from 'src/api/h5p/h5p-content.list';
import { Modal } from 'src/components/Modal';
import { AdminTile } from 'src/components/admin/AdminTile';
import { OneVillageTable } from 'src/components/admin/OneVillageTable';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';

const H5pList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data: h5pContent } = useH5pContentList();
  const [deleteIndex, setDeleteIndex] = React.useState(-1);
  const { mutate: deleteH5pMutate, isLoading } = useDeleteH5pContentMutation();

  const actions = (id: string) => (
    <>
      <Tooltip title="Modifier">
        <IconButton
          aria-label="edit"
          onClick={() => {
            router.push(`/admin/h5p/edit/${id}`);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton
          aria-label="delete"
          onClick={() => {
            setDeleteIndex((h5pContent || []).findIndex((h5p) => h5p.contentId === id));
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <div className="admin--container">
      <Link href="/admin/h5p" passHref>
        <MaterialLink>
          <h1 style={{ marginBottom: '1rem' }}>Contenu H5P</h1>
        </MaterialLink>
      </Link>
      <AdminTile
        title="Liste du contenu H5P"
        toolbarButton={
          <Link href="/admin/h5p/new" passHref>
            <Button
              color="inherit"
              sx={defaultContainedButtonStyle}
              component="a"
              variant="contained"
              style={{ flexShrink: 0 }}
              startIcon={<AddCircleIcon />}
            >
              Ajouter un contenu H5P
            </Button>
          </Link>
        }
      >
        <OneVillageTable
          admin
          emptyPlaceholder={
            <>
              {"Vous n'avez pas encore de contenu H5P ! "}
              <Link href="/admin/h5p/new" passHref>
                <a className="text text--primary text--small">En créer un ?</a>
              </Link>
            </>
          }
          data={(h5pContent || []).map((h5p) => ({ ...h5p, id: h5p.contentId }))}
          columns={[
            { key: 'title', label: 'Nom du contenu', sortable: true },
            { key: 'mainLibrary', label: 'Type' },
          ]}
          actions={actions}
        />
      </AdminTile>
      <NoSsr>
        <Modal
          title="Confirmer la suppression"
          open={deleteIndex !== -1}
          onClose={() => {
            setDeleteIndex(-1);
          }}
          onConfirm={() => {
            deleteH5pMutate(h5pContent?.[deleteIndex]?.contentId || '', {
              onSettled: () => {
                queryClient.invalidateQueries('h5p');
                setDeleteIndex(-1);
              },
              onError: () => {
                enqueueSnackbar('Une erreur est survenue...', {
                  variant: 'error',
                });
              },
              onSuccess: () => {
                enqueueSnackbar('Contenu H5P supprimé avec succès!', {
                  variant: 'success',
                });
              },
            });
          }}
          loading={isLoading}
          fullWidth
          maxWidth="sm"
          ariaLabelledBy="delete-h5p-id"
          ariaDescribedBy="delete-h5p-desc"
          error
        >
          <div id="delete-h5p-desc">
            Voulez vous vraiment supprimer le contenu H5P <strong>{(h5pContent || [])[deleteIndex]?.title}</strong> ?
          </div>
        </Modal>
      </NoSsr>
    </div>
  );
};

export default H5pList;
