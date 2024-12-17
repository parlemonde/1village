import { useSnackbar } from 'notistack';
import React, { useState, useMemo } from 'react';
import { useQueryClient } from 'react-query';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Grid,
  Paper,
  Box,
  TableContainer,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useFeatureFlags } from 'src/api/featureFlag/featureFlag.get';
import { useUsers } from 'src/api/user/user.list';
import { axiosRequest } from 'src/utils/axiosRequest';
import { FEATURE_FLAGS_NAMES } from 'types/featureFlag.constant';
import type { User, UserType } from 'types/user.type';
import { userTypeNames } from 'types/user.type';

const FeatureFlagsTest: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: featureFlags } = useFeatureFlags();
  const { data: users } = useUsers();
  const [newFeatureFlag, setNewFeatureFlag] = useState({ name: '', isEnabled: false });
  const [userFilter, setUserFilter] = useState<string>('');

  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | ''>('');
  const [countryCodeFilter, setCountryCodeFilter] = useState<string>('');

  const filteredUsers = useMemo(() => {
    const usersWithoutAccess = (users || []).filter((user) => !addedUsers?.find((addedUser) => addedUser.id === user.id));

    let filtered = usersWithoutAccess;

    if (userFilter) {
      filtered = filtered.filter((user) => user.email.toLowerCase().includes(userFilter.toLowerCase()));
    }

    if (userTypeFilter !== '') {
      filtered = filtered.filter((user) => user.type === userTypeFilter);
    }

    if (countryCodeFilter) {
      filtered = filtered.filter((user) => user.country?.isoCode === countryCodeFilter);
    }

    return filtered;
  }, [users, userFilter, addedUsers, userTypeFilter, countryCodeFilter]);

  const filteredAddedUsers = useMemo(() => {
    let filtered = addedUsers;

    if (userFilter) {
      filtered = filtered.filter((user) => user.email.toLowerCase().includes(userFilter.toLowerCase()));
    }

    if (userTypeFilter !== '') {
      filtered = filtered.filter((user) => user.type === userTypeFilter);
    }

    if (countryCodeFilter) {
      filtered = filtered.filter((user) => user.country?.isoCode === countryCodeFilter);
    }

    return filtered;
  }, [addedUsers, userFilter, userTypeFilter, countryCodeFilter]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNewFeatureFlagChange = async (event: SelectChangeEvent<string>) => {
    const featureFlagName = event.target.value;

    // Find the feature flag object from the featureFlags state using the selected feature flag name
    const selectedFeatureFlag = (featureFlags || []).find((flag) => flag.name === featureFlagName);

    if (selectedFeatureFlag) {
      // Update the newFeatureFlag and addedUsers states with the selected feature flag data
      setNewFeatureFlag({
        name: selectedFeatureFlag.name,
        isEnabled: selectedFeatureFlag.isEnabled,
      });
      setAddedUsers(selectedFeatureFlag.users || []);
    } else {
      // Reset the newFeatureFlag and addedUsers states if the selected feature flag is not found
      setNewFeatureFlag({ name: '', isEnabled: false });
      setAddedUsers([]);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeatureFlag({ ...newFeatureFlag, isEnabled: event.target.value === 'true' });
  };

  const handleUserFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilter(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newFeatureFlag.name) {
      alert('Please select a feature flag.');
      return;
    }

    const addedUserIds = addedUsers.map((user) => user.id);

    const response = await axiosRequest({
      method: 'POST',
      url: '/featureFlags',
      data: {
        name: newFeatureFlag.name,
        isEnabled: newFeatureFlag.isEnabled,
        users: addedUserIds,
      },
    });
    if (response.error) {
      enqueueSnackbar('Erreur, impossible de mettre à jour le feature flag...', {
        variant: 'error',
      });
      const selectedFeatureFlag = (featureFlags || []).find((flag) => flag.name === newFeatureFlag.name);
      if (selectedFeatureFlag) {
        setNewFeatureFlag({
          name: selectedFeatureFlag.name,
          isEnabled: selectedFeatureFlag.isEnabled,
        });
        setAddedUsers(selectedFeatureFlag.users || []);
      }
    } else {
      queryClient.invalidateQueries('feature-flags');
      enqueueSnackbar('Feature flag mis à jour !', {
        variant: 'success',
      });
    }
  };

  const handleAddUser = (userId: number) => {
    const userToAdd = filteredUsers.find((user) => user.id === userId);
    if (userToAdd) {
      setAddedUsers((prevAddedUsers) => [...(prevAddedUsers || []), userToAdd]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setAddedUsers((prevAddedUsers) => prevAddedUsers.filter((user) => user.id !== userId));
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Gestion des feature flags (restrictions d&apos;accès)</Typography>
      <Typography variant="h6" my={2}>
        Choisir une restriction
      </Typography>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl style={{ flex: '1 1 0', marginRight: '2rem' }}>
            <InputLabel>Feature Flag</InputLabel>
            <Select
              sx={{ minWidth: '10rem', width: '100%', backgroundColor: 'white' }}
              label="Feature Flag"
              name="name"
              value={newFeatureFlag.name}
              onChange={handleNewFeatureFlagChange}
            >
              {FEATURE_FLAGS_NAMES?.map((flag, index) => (
                <MenuItem key={index} value={flag}>
                  {flag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" disabled={!newFeatureFlag.name}>
            Appliquer les changements
          </Button>
        </div>

        {newFeatureFlag.name && (
          <>
            <Typography variant="h6" my={2}>
              État
            </Typography>
            <RadioGroup value={newFeatureFlag.isEnabled} onChange={handleCheckboxChange} aria-labelledby="">
              <FormControlLabel style={{ cursor: 'pointer' }} value={true} control={<Radio />} label="Actif pour tout le monde" />
              <FormControlLabel style={{ cursor: 'pointer' }} value={false} control={<Radio />} label="Actif pour certains utilisateurs" />
            </RadioGroup>
          </>
        )}

        {newFeatureFlag.name && !newFeatureFlag.isEnabled && (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="h6" my={2}>
                Utilisateurs
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                style={{ width: '100%' }}
                label="Filtre utilisateur"
                placeholder="Filtre utilisateur"
                value={userFilter}
                onChange={handleUserFilterChange}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel>Type d&apos;utilisateur</InputLabel>
                <Select
                  sx={{ minWidth: '10rem' }}
                  label="Type d'utilisateur"
                  value={userTypeFilter}
                  onChange={(event: SelectChangeEvent<UserType | ''>) => setUserTypeFilter(event.target.value as UserType | '')}
                >
                  <MenuItem value="">
                    <em>Aucun</em>
                  </MenuItem>
                  {Object.entries(userTypeNames).map(([key, value]) => (
                    <MenuItem key={key} value={parseInt(key, 10)}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                style={{ width: '100%' }}
                label="Code pays"
                placeholder="Code pays"
                value={countryCodeFilter}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCountryCodeFilter(event.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </form>

      {newFeatureFlag.name && !newFeatureFlag.isEnabled && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" my={2}>
              Utilisateurs sans accès
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Pseudo</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Country Code</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.pseudo}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.country?.isoCode}</TableCell>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="success" onClick={() => handleAddUser(user.id)}>
                          +
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" my={2}>
              <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Prev
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" my={2}>
              Utilisateurs avec accès{' '}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Pseudo</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Country Code</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAddedUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.pseudo}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.country?.isoCode}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" onClick={() => handleRemoveUser(user.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FeatureFlagsTest;
