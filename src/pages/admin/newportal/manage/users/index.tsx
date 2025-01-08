import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SetStateAction } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { UpdateFilter } from 'typeorm';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import type { SelectChangeEvent } from '@mui/material';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import NoSsr from '@mui/material/NoSsr';
import Tooltip from '@mui/material/Tooltip';

import { useUsers } from 'src/api/user/user.list';
import { Modal } from 'src/components/Modal';
import { AdminTile } from 'src/components/admin/AdminTile';
import { OneVillageTable } from 'src/components/admin/OneVillageTable';
import { createUsersRows } from 'src/components/admin/manage/utils/tableCreator';
import { ManageUsersHeaders } from 'src/components/admin/manage/utils/tableHeaders';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
import BackArrow from 'src/svg/back-arrow.svg';
import { countryToFlag } from 'src/utils';
import { exportJsonToCsv } from 'src/utils/csv-export';
import type { UserFilter } from 'types/manage.type';
import type { OneVillageTableRow } from 'types/statistics.type';
import { userTypeNames } from 'types/user.type';
import type { Village } from 'types/village.type';

const Users = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { data, isLoading } = useUsers();
  const [usersRows, setUsersRows] = React.useState<Array<OneVillageTableRow>>([]);
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
  const [filters, setFilters] = useState<UserFilter>({});

  React.useEffect(() => {
    if (data) {
      setUsersRows([]);
      setUsersRows(createUsersRows(data));
    }
  }, [data]);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        if (filters.fullname)
          return [(u.firstname, u.lastname)].some((field) => filters.fullname && field?.toLowerCase().includes(filters.fullname.toLowerCase()));
        if (filters.email) return u.email.toLowerCase().includes(filters.email.toLowerCase());
        if (filters.villageName && u.villageId) return villageMap[u.villageId].name.toLowerCase().includes(filters.villageName.toLowerCase());
        if (filters.countryIsoCode) return u.country?.isoCode.toLowerCase().includes(filters.countryIsoCode.toLowerCase());
        if (filters.type) return u.type === parseInt(filters.type);

        return true;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, filters],
  );

  const tableData = useMemo(() => {
    console.log('FILTER', filters);
    console.log('FILTERD USERS', filteredUsers);
    return filteredUsers.map((u) => ({
      ...u,
      country: u.country ? `${countryToFlag(u.country?.isoCode)} ${u.country?.name}` : <span style={{ color: 'grey' }}>Non renseignée</span>,
      village: u.villageId ? (
        villageMap[u.villageId]?.name || <span style={{ color: 'grey' }}>Non assigné</span>
      ) : (
        <span style={{ color: 'grey' }}>Non assigné</span>
      ),
      type: <Chip size="small" label={userTypeNames[u.type]} />,
      position: null,
    }));
  }, [filteredUsers, filters, villageMap]);

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
            router.push(`/admin/newportal/manage/users/edit/${id}`);
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
    <div>
      <Link href="/admin/newportal/manage">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Utilisateurs</h1>
        </div>
      </Link>

      <p>Il y a ici la liste complète des utilisateurs de 1Vilage</p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', margin: '16px 0' }}>
        <Button
          className="like-button blue"
          sx={{ ...defaultContainedButtonStyle, width: 'auto' }}
          component="a"
          onClick={handleExportToCSV}
          disabled={filteredUsers.length === 0}
        >
          Exporter en CSV
        </Button>
        <Link href="/admin/newportal/manage/users/new" passHref>
          <Button className="like-button blue" sx={defaultContainedButtonStyle} component="a" href="/admin/newportal/manage/users/new">
            Ajouter un utilisateur
          </Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', width: '75%', margin: '16px 0' }}>
        <TextField
          label="Prénom et nom"
          value={filters.fullname}
          onChange={(e) => handleChange({ fullname: e.target.value })}
          variant="outlined"
          size="small"
        />
        <TextField label="Mail" value={filters.email} onChange={(e) => handleChange({ email: e.target.value })} variant="outlined" size="small" />
        <TextField
          label="Village Monde"
          value={filters.villageName}
          onChange={(e) => handleChange({ villageName: e.target.value })}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Pays"
          value={filters.countryIsoCode}
          onChange={(e) => handleChange({ countryIsoCode: e.target.value })}
          variant="outlined"
          size="small"
        />
        <TextField label="Rôle" value={filters.type} onChange={(e) => handleChange({ type: e.target.value })} variant="outlined" size="small" />
      </div>

      <OneVillageTable admin={true} emptyPlaceholder={undefined} data={tableData} columns={ManageUsersHeaders} actions={actions} />
    </div>
    // <div>
    //   <Link href="/admin/newportal/manage">
    //     <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    //       <BackArrow />
    //       <h1 style={{ marginLeft: '10px' }}>Utilisateurs</h1>
    //     </div>
    //   </Link>
    //   <AdminTile
    //     title="Liste des utilisateurs"
    //     toolbarButton={
    // <Link href="/admin/newportal/manage/users/new" passHref>
    //   <Button
    //     color="inherit"
    //     sx={defaultContainedButtonStyle}
    //     component="a"
    //     href="/admin/newportal/manage/users/new"
    //     variant="contained"
    //     style={{ flexShrink: 0 }}
    //     startIcon={<AddCircleIcon />}
    //   >
    //     Ajouter un utilisateur
    //   </Button>
    // </Link>
    //     }
    //   >
    //     {/* //// */}
    //     <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem', gap: '5px' }}>
    // <TextField
    //   label="Rechercher par email ou pseudo"
    //   value={search}
    //   onChange={handleChange}
    //   variant="outlined"
    //   size="small"
    //   style={{ marginRight: '1rem' }}
    // />
    // <TextField
    //   label="Rechercher par code pays"
    //   value={countrySearch}
    //   onChange={handleCountryChange}
    //   variant="outlined"
    //   size="small"
    //   style={{ marginRight: '1rem' }}
    // />
    //       <FormControl variant="outlined" size="small" sx={{ minWidth: '10rem' }}>
    //         <InputLabel htmlFor="user-type-filter">Filtrer par rôle</InputLabel>
    //         <Select
    //           label="Filtrer par rôle"
    //           value={userTypeFilter}
    //           onChange={handleSelect}
    //           inputProps={{
    //             name: 'user-type-filter',
    //             id: 'user-type-filter',
    //           }}
    //         >
    //           <MenuItem value="">
    //             <em>Tous les rôles</em>
    //           </MenuItem>
    //           {Object.entries(userTypeNames).map(([value, label]) => (
    //             <MenuItem key={value} value={value}>
    //               {label}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>
    // <Button
    //   className="like-button blue"
    //   sx={defaultContainedButtonStyle}
    //   component="a"
    //   onClick={handleExportToCSV}
    //   style={{ flexShrink: 0, marginLeft: '1rem' }}
    //   startIcon={<DownloadIcon />}
    //   disabled={filteredUsers.length === 0}
    // >
    //   Exporter en CSV
    // </Button>
    //     </div>
    //     {/* //// */}

    //     <Box sx={{ overflow: 'auto', border: '1px solid black' }}>
    //       <OneVillageTable
    //         admin
    //         emptyPlaceholder={isLoading ? 'Chargement...' : "Vous n'avez pas encore d'utilisateur !"}
    //         data={tableData.map((data) => ({ ...data, position: null }))} // remove position attribute from data
    //         columns={[
    //           { key: 'firstname', label: 'Prénom', sortable: true },
    //           { key: 'lastname', label: 'Nom', sortable: true },
    //           { key: 'email', label: 'Email', sortable: true },
    //           { key: 'school', label: 'École', sortable: true },
    //           { key: 'village', label: 'Village', sortable: true },
    //           { key: 'country', label: 'Pays', sortable: true },
    //           { key: 'type', label: 'Rôle', sortable: true },
    //         ]}
    //         actions={actions}
    //       />
    //     </Box>
    //   </AdminTile>
    //   <NoSsr>
    //     <Modal
    //       title="Confirmer la suppression"
    //       open={deleteIndex !== -1}
    //       onClose={() => {
    //         setDeleteIndex(-1);
    //       }}
    //       onConfirm={async () => {
    //         await deleteUser(users[deleteIndex]?.id || -1);
    //         setDeleteIndex(-1);
    //       }}
    //       fullWidth
    //       maxWidth="sm"
    //       ariaLabelledBy="delete-village-id"
    //       ariaDescribedBy="delete-village-desc"
    //       error
    //     >
    //       <div id="delete-village-desc">
    //         {"Voulez vous vraiment supprimer l'utilisateur "}
    //         <strong>{users[deleteIndex]?.pseudo}</strong> ?
    //       </div>
    //     </Modal>
    //   </NoSsr>
    // </div>
  );
};

export default Users;
