import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MaterialLink from '@mui/material/Link';
import NoSsr from '@mui/material/NoSsr';
import Tooltip from '@mui/material/Tooltip';

import { useUsers } from 'src/api/user/user.list';
import { Modal } from 'src/components/Modal';
import { AdminTable } from 'src/components/admin/AdminTable';
import { AdminTile } from 'src/components/admin/AdminTile';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
import { countryToFlag } from 'src/utils';
import { exportJsonToCsv } from 'src/utils/csv-export';
import { userTypeNames } from 'types/user.type';
import type { Village } from 'types/village.type';

const Users = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { data, isLoading } = useUsers();
  const users = React.useMemo(() => data || [], [data]);
  const { villages } = useVillages();
  const villageMap = villages.reduce<{ [key: number]: Village }>((acc, village) => {
    acc[village.id] = village;
    return acc;
  }, {});
  const { deleteUser } = useUserRequests();
  const [deleteIndex, setDeleteIndex] = React.useState(-1);
  const [search, setSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const searchMatch = [u.pseudo, u.email].some((field) => field?.toLowerCase().includes(search.toLowerCase()));
        const countryMatch = u.country?.isoCode.toLowerCase().includes(countrySearch.toLowerCase());
        const userTypeMatch = userTypeFilter ? u.type === parseInt(userTypeFilter) : true;

        return searchMatch && userTypeMatch && countryMatch;
      }),
    [users, search, userTypeFilter, countrySearch],
  );
  const tableData = useMemo(
    () =>
      filteredUsers.map((u) => ({
        ...u,
        country: u.country ? `${countryToFlag(u.country?.isoCode)} ${u.country?.name}` : <span style={{ color: 'grey' }}>Non renseignée</span>,
        village: u.villageId ? (
          villageMap[u.villageId]?.name || <span style={{ color: 'grey' }}>Non assigné</span>
        ) : (
          <span style={{ color: 'grey' }}>Non assigné</span>
        ),
        type: <Chip size="small" label={userTypeNames[u.type]} />,
      })),
    [filteredUsers, villageMap],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearch(e.target.value);
  }, []);

  const handleSelect = useCallback((e: SelectChangeEvent<string>) => {
    setUserTypeFilter(e.target.value);
  }, []);

  const handleExportToCSV = () => {
    if (filteredUsers.length === 0) {
      return;
    }

    const datasToExport = filteredUsers.map((user) => {
      return {
        firstname: user.firstname ? user.firstname : 'Non renseigné',
        lastname: user.lastname ? user.lastname : 'Non renseigné',
        email: user.email,
        school: user.school ? user.school : 'Non renseignée',
        village: user.villageId ? villageMap[user.villageId]?.name : 'Non renseigné',
        country: user.country ? user.country.name : 'Non renseignée',
        type: user.type ? userTypeNames[user.type] : 'Non renseigné',
      };
    });

    const headers = ['Prenom', 'Nom', 'Email', 'Ecole', 'Village', 'Pays', 'Rôle'];

    let userLabel = 'liste-utilisateurs-';

    for (const [key, value] of Object.entries(userTypeNames)) {
      if (key === userTypeFilter) {
        userLabel = 'liste-' + value.toLowerCase().replaceAll(' ', '-') + 's-';
      }
    }
    const todayDate = new Date().toLocaleDateString('fr-FR').replaceAll('/', '-');
    const fileName = userLabel + todayDate;

    exportJsonToCsv(fileName, headers, datasToExport);
  };

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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <Typography variant="subtitle1" style={{ marginRight: '1rem', marginLeft: '1rem' }}>
            Filtres utilisateurs :
          </Typography>
          <TextField
            label="Rechercher par email ou pseudo"
            value={search}
            onChange={handleChange}
            variant="outlined"
            size="small"
            style={{ marginRight: '1rem' }}
          />
          <TextField
            label="Rechercher par code pays"
            value={countrySearch}
            onChange={handleCountryChange}
            variant="outlined"
            size="small"
            style={{ marginRight: '1rem' }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: '10rem' }}>
            <InputLabel htmlFor="user-type-filter">Filtrer par rôle</InputLabel>
            <Select
              label="Filtrer par rôle"
              value={userTypeFilter}
              onChange={handleSelect}
              inputProps={{
                name: 'user-type-filter',
                id: 'user-type-filter',
              }}
            >
              <MenuItem value="">
                <em>Tous les rôles</em>
              </MenuItem>
              {Object.entries(userTypeNames).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            color="inherit"
            sx={defaultContainedButtonStyle}
            component="a"
            onClick={handleExportToCSV}
            variant="contained"
            style={{ flexShrink: 0, marginLeft: '1rem' }}
            startIcon={<DownloadIcon />}
            disabled={filteredUsers.length === 0}
          >
            Exporter en CSV
          </Button>
        </div>
        <AdminTable
          emptyPlaceholder={isLoading ? 'Chargement...' : "Vous n'avez pas encore d'utilisateur !"}
          data={tableData.map((data) => ({ ...data, position: null }))} // remove position attribute from data
          columns={[
            { key: 'firstname', label: 'Prénom', sortable: true },
            { key: 'lastname', label: 'Nom', sortable: true },
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
