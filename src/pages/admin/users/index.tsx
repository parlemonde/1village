import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MaterialLink from '@mui/material/Link';
import NoSsr from '@mui/material/NoSsr';
import Tooltip from '@mui/material/Tooltip';

import { Modal } from 'src/components/Modal';
import { AdminTable } from 'src/components/admin/AdminTable';
import { AdminTile } from 'src/components/admin/AdminTile';
import { UserContext } from 'src/contexts/userContext';
import { useUsers, useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
import { countryToFlag } from 'src/utils';
import { userTypeNames } from 'types/user.type';
import type { Village } from 'types/village.type';

const Users = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { users } = useUsers();
  const { villages } = useVillages();
  const villageMap = villages.reduce<{ [key: number]: Village }>((acc, village) => {
    acc[village.id] = village;
    return acc;
  }, {});
  const { deleteUser } = useUserRequests();
  const [deleteIndex, setDeleteIndex] = React.useState(-1);

  const actions = (id: number) => (
    <>
      <Tooltip title="Modifier">
        <IconButton
          aria-label="edit"
          onClick={() => {
            router.push(`/admin/users/edit/${id}`);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      {user && user.id !== id && (
        <Tooltip title="Supprimer">
          <IconButton
            aria-label="delete"
            onClick={() => {
              setDeleteIndex(users.findIndex((u) => u.id === id));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <div className="admin--container">
      <Link href="/admin/users" passHref>
        <MaterialLink href="/admin/users">
          <h1 style={{ marginBottom: '1rem' }}>Utilisateurs</h1>
        </MaterialLink>
      </Link>
      <AdminTile
        title="Liste des utilisateurs"
        toolbarButton={
          <Link href="/admin/users/new" passHref>
            <Button
              color="inherit"
              sx={defaultContainedButtonStyle}
              component="a"
              href="/admin/users/new"
              variant="contained"
              style={{ flexShrink: 0 }}
              startIcon={<AddCircleIcon />}
            >
              Ajouter un utilisateur
            </Button>
          </Link>
        }
      >
        <AdminTable
          emptyPlaceholder="Vous n'avez pas encore d'utilisateur !"
          data={users.map((u) =>
            u.country
              ? {
                  id: u.id,
                  pseudo: u.pseudo,
                  email: u.email,
                  school: u.school || <span style={{ color: 'grey' }}>Non renseignée</span>,
                  country: `${countryToFlag(u.country?.isoCode)} ${u.country?.name}`,
                  village: u.villageId ? (
                    villageMap[u.villageId]?.name || <span style={{ color: 'grey' }}>Non assigné</span>
                  ) : (
                    <span style={{ color: 'grey' }}>Non assigné</span>
                  ),
                  type: <Chip size="small" label={userTypeNames[u.type]} />,
                }
              : {
                  id: u.id,
                  pseudo: u.pseudo,
                  email: u.email,
                  school: u.school || <span style={{ color: 'grey' }}>Non renseignée</span>,
                  village: u.villageId ? (
                    villageMap[u.villageId]?.name || <span style={{ color: 'grey' }}>Non assigné</span>
                  ) : (
                    <span style={{ color: 'grey' }}>Non assigné</span>
                  ),
                  type: <Chip size="small" label={userTypeNames[u.type]} />,
                },
          )}
          columns={[
            { key: 'pseudo', label: 'Pseudo', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'school', label: 'École', sortable: true },
            { key: 'village', label: 'Village', sortable: true },
            { key: 'country', label: 'Pays', sortable: true },
            { key: 'type', label: 'Rôle', sortable: true },
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
          onConfirm={async () => {
            await deleteUser(users[deleteIndex]?.id || -1);
            setDeleteIndex(-1);
          }}
          fullWidth
          maxWidth="sm"
          ariaLabelledBy="delete-village-id"
          ariaDescribedBy="delete-village-desc"
          error
        >
          <div id="delete-village-desc">
            {"Voulez vous vraiment supprimer l'utilisateur "}
            <strong>{users[deleteIndex]?.pseudo}</strong> ?
          </div>
        </Modal>
      </NoSsr>
    </div>
  );
};

export default Users;
