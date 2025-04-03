import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SetStateAction } from 'react';
import React, { useMemo, useState } from 'react';

import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import NoSsr from '@mui/material/NoSsr';

import { useUsers } from 'src/api/user/user.list';
import { Modal } from 'src/components/Modal';
import { AdminTile } from 'src/components/admin/AdminTile';
import { OneVillageTable } from 'src/components/admin/OneVillageTable';
import OneVillageTableActionMenu from 'src/components/admin/OneVillageTableActionMenu';
import { ManageUsersHeaders } from 'src/components/admin/manage/utils/tableHeaders';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
import BackArrow from 'src/svg/back-arrow.svg';
import { countryToFlag } from 'src/utils';
import { exportJsonToCsv } from 'src/utils/csv-export';
import { normalizeString } from 'src/utils/string';
import type { UserFilter } from 'types/manage.type';
import { UserType, userTypeNames } from 'types/user.type';
import type { Village } from 'types/village.type';

const Users = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { data } = useUsers();
  const users = React.useMemo(() => data || [], [data]);
  const [filters, setFilters] = useState<UserFilter>({});
  const { villages } = useVillages();
  const villageMap = villages.reduce<{ [key: number]: Village }>((acc, village) => {
    acc[village.id] = village;
    return acc;
  }, {});
  const { deleteUser } = useUserRequests();
  const [deleteIndex, setDeleteIndex] = React.useState(-1);

  const TABLE_ENTRIES_BY_PAGE = 5;

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const normalizedFullname = filters.fullname ? normalizeString(filters.fullname.toLowerCase()) : '';
        const normalizedEmail = filters.email ? normalizeString(filters.email.toLowerCase()) : '';
        const normalizedVillageName = filters.villageName && u.villageId ? normalizeString(villageMap[u.villageId].name.toLowerCase()) : '';
        const normalizedCountry = filters.country ? normalizeString(filters.country.toLowerCase()) : '';

        if (filters.fullname) {
          const normalizedFirstname = normalizeString(u.firstname.toLowerCase());
          const normalizedLastname = normalizeString(u.lastname.toLowerCase());
          return [normalizedFirstname, normalizedLastname].some((field) => field.includes(normalizedFullname));
        }
        if (filters.email) {
          const normalizedEmailValue = normalizeString(u.email.toLowerCase());
          return normalizedEmailValue.includes(normalizedEmail);
        }
        if (filters.villageName) {
          const searchTerm = normalizeString(filters.villageName.toLowerCase());

          if (!u.villageId || !villageMap[u.villageId]) {
            return false;
          }
          return normalizedVillageName.includes(searchTerm);
        }
        if (filters.country) {
          const normalizedCountryName = u.country ? normalizeString(u.country?.name.toLowerCase()) : '';
          return normalizedCountryName.includes(normalizedCountry);
        }
        if (filters.type !== undefined || (filters.type && parseInt(filters.type) === 0)) {
          return u.type === parseInt(filters.type);
        }

        return true;
      }),
    [users, filters.type, filters.fullname, filters.email, filters.villageName, filters.country, villageMap],
  );

  const tableData = useMemo(() => {
    return filteredUsers.map((u) => ({
      ...u,
      country: u.country ? `${countryToFlag(u.country?.isoCode)} ${u.country?.name}` : <span style={{ color: 'grey' }}>Non renseignée</span>,
      village: u.villageId ? (
        villageMap[u.villageId]?.name || <span style={{ color: 'grey' }}>Non assigné</span>
      ) : (
        <span style={{ color: 'grey' }}>Non assigné</span>
      ),
      type: userTypeNames[u.type],
      position: null,
    }));
  }, [filteredUsers, villageMap]);

  const handleChange = (updatedFilter: SetStateAction<UserFilter>) => {
    setFilters({ ...filters, ...updatedFilter });
  };

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
      if (key === filters.type) {
        userLabel = 'liste-' + value.toLowerCase().replaceAll(' ', '-') + 's-';
      }
    }
    const todayDate = new Date().toLocaleDateString('fr-FR').replaceAll('/', '-');
    const fileName = userLabel + todayDate;

    exportJsonToCsv(fileName, headers, datasToExport);
  };

  const actions = (id: number) => (
    <OneVillageTableActionMenu>
      <MenuItem
        aria-label="edit"
        onClick={() => {
          router.push(`/admin/newportal/manage/users/edit/${id}`);
        }}
      >
        Modifier
      </MenuItem>
      <MenuItem aria-label="analyse" onClick={() => {}} disabled>
        Analyser
      </MenuItem>
      <MenuItem aria-label="unblock" onClick={() => {}} disabled>
        Débloquer
      </MenuItem>
      <MenuItem
        aria-label="delete"
        onClick={() => {
          setDeleteIndex(users.findIndex((u) => u.id === id));
        }}
      >
        Supprimer
      </MenuItem>
    </OneVillageTableActionMenu>
  );

  return (
    <div>
      <Link href="/admin/newportal/manage">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Utilisateurs</h1>
        </div>
      </Link>
      <AdminTile
        title="Il y a ici la liste complète des utilisateurs de 1Village"
        toolbarButton={
          user &&
          (user.type === UserType.SUPER_ADMIN || user.type === UserType.ADMIN) && (
            <Box style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', margin: '16px 0' }}>
              <Button className="like-button blue" component="a" onClick={handleExportToCSV} disabled={filteredUsers.length === 0}>
                Exporter en CSV
              </Button>
              <Link href="/admin/newportal/manage/users/new" passHref>
                <Button className="like-button blue" sx={defaultContainedButtonStyle} component="a" href="/admin/newportal/manage/users/new">
                  Ajouter un utilisateur
                </Button>
              </Link>
            </Box>
          )
        }
      >
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            width: '75%',
            margin: '16px 0',
            '& > *': {
              flex: 1,
            },
          }}
        >
          <TextField
            label="Prénom et nom"
            value={filters.fullname}
            onChange={(e) => handleChange({ fullname: e.target.value })}
            variant="outlined"
            size="small"
          />
          <TextField label="Mail" value={filters.email} onChange={(e) => handleChange({ email: e.target.value })} variant="outlined" size="small" />

          <FormControl fullWidth size="small">
            <InputLabel id="village-label">Village Monde</InputLabel>
            <Select
              labelId="village-label"
              id="village-select"
              value={filters.villageName}
              label="Village Monde" // fix display bug label
              onChange={(e) => {
                handleChange({ villageName: e.target.value });
              }}
            >
              <MenuItem value="">
                <em>Aucun</em>
              </MenuItem>
              {villages.map((village) => (
                <MenuItem key={village.name} value={village.name}>
                  {village.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="country-label">Pays</InputLabel>
            <Select
              labelId="country-label"
              id="country-select"
              value={filters.country}
              label="Pays" // fix display bug label
              onChange={(e) => {
                handleChange({ country: e.target.value });
              }}
            >
              <MenuItem value="">
                <em>Aucun</em>
              </MenuItem>
              {[...new Set(users.map((user) => user.country?.name))].map((countryName) => (
                <MenuItem key={countryName} value={countryName}>
                  {countryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="role-label">Rôle</InputLabel>
            <Select
              labelId="role-label"
              id="demo-simple-select"
              value={filters.type}
              label="Rôle" // fix bug display label
              onChange={(e) => {
                handleChange({ type: e.target.value });
              }}
            >
              <MenuItem value="">
                <em>Aucun</em>
              </MenuItem>
              {[UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MEDIATOR, UserType.TEACHER, UserType.FAMILY, UserType.OBSERVATOR].map((type) => (
                <MenuItem key={type} value={type}>
                  {userTypeNames[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <OneVillageTable
          admin={true}
          emptyPlaceholder={undefined}
          data={tableData}
          columns={ManageUsersHeaders}
          actions={actions}
          usePagination={tableData.length > TABLE_ENTRIES_BY_PAGE}
          footerElementsLabel="utilisateur"
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
