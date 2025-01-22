import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SetStateAction } from 'react';
import React, { useMemo, useState } from 'react';

import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import NoSsr from '@mui/material/NoSsr';

import { useUsers } from 'src/api/user/user.list';
import { Modal } from 'src/components/Modal';
import { OneVillageTable } from 'src/components/admin/OneVillageTable';
import { ManageUsersHeaders } from 'src/components/admin/manage/utils/tableHeaders';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
import BackArrow from 'src/svg/back-arrow.svg';
import { countryToFlag } from 'src/utils';
import { exportJsonToCsv } from 'src/utils/csv-export';
import type { UserFilter } from 'types/manage.type';
import { UserType, userTypeNames } from 'types/user.type';
import type { Village } from 'types/village.type';

const Users = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { data, isLoading } = useUsers();
  const users = React.useMemo(() => data || [], [data]);
  const [filters, setFilters] = useState<UserFilter>({});
  const { villages } = useVillages();
  const villageMap = villages.reduce<{ [key: number]: Village }>((acc, village) => {
    acc[village.id] = village;
    return acc;
  }, {});
  const { deleteUser } = useUserRequests();
  const [deleteIndex, setDeleteIndex] = React.useState(-1);

  const TABLE_ENTRIES_BY_PAGE = 6;

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        if (filters.fullname)
          return [(u.firstname, u.lastname)].some((field) => filters.fullname && field?.toLowerCase().includes(filters.fullname.toLowerCase()));
        if (filters.email) return u.email.toLowerCase().includes(filters.email.toLowerCase());
        if (filters.villageName && u.villageId) return villageMap[u.villageId].name.toLowerCase().includes(filters.villageName.toLowerCase());
        if (filters.country) return u.country?.name.toLowerCase().includes(filters.country.toLowerCase());
        if (filters.type || (filters.type && parseInt(filters.type) === 0)) return u.type === parseInt(filters.type);

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
      type: <Chip size="small" label={userTypeNames[u.type]} />,
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
    <>
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

      {/* {user?.type === UserType.SUPER_ADMIN ||
        (user?.type === UserType.ADMIN && ( */}
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
      {/* ))} */}

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
        <TextField
          label="Village Monde"
          value={filters.villageName}
          onChange={(e) => handleChange({ villageName: e.target.value })}
          variant="outlined"
          size="small"
        />
        <TextField label="Pays" value={filters.country} onChange={(e) => handleChange({ country: e.target.value })} variant="outlined" size="small" />
        <FormControl size="small">
          <InputLabel id="demo-simple-select-label">Rôle</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            variant="outlined"
            value={filters.type}
            onChange={(e) => {
              handleChange({ type: e.target.value });
            }}
            displayEmpty
          >
            <MenuItem value={''}>Tous</MenuItem>
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
        footerElementsLabel="utilisateurs"
      />
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
