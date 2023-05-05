import React, { useState, useEffect, useMemo } from 'react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
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

import { getUsers } from 'src/api/user/user.get';
import { axiosRequest } from 'src/utils/axiosRequest';
import { FEATURE_FLAGS } from 'types/featureFlag.constant';
import type { User } from 'types/user.type';

interface FeatureFlag {
  id: number;
  name: string;
  isEnabled: boolean;
  users: User[];
}

const FeatureFlagsTest: React.FC = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [newFeatureFlag, setNewFeatureFlag] = useState({ name: '', isEnabled: false });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userFilter, setUserFilter] = useState<string>('');

  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  const filteredUsers = useMemo(() => {
    const usersWithoutAccess = users.filter((user) => !addedUsers?.find((addedUser) => addedUser.id === user.id));

    if (userFilter) {
      return usersWithoutAccess.filter((user) => user.email.toLowerCase().includes(userFilter.toLowerCase()));
    } else {
      return usersWithoutAccess;
    }
  }, [users, userFilter, addedUsers]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFeatureFlags = await fetchFeatureFlags();
      setFeatureFlags(fetchedFeatureFlags);

      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchData();
  }, []);

  const fetchFeatureFlags = async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/featureFlags`,
    });

    if (response.error) {
      return [];
    }

    return response.data;
  };

  const handleNewFeatureFlagChange = async (event: SelectChangeEvent<string>) => {
    const featureFlagName = event.target.value;

    // Find the feature flag object from the featureFlags state using the selected feature flag name
    const selectedFeatureFlag = featureFlags.find((flag: FeatureFlag) => flag.name === featureFlagName);

    if (selectedFeatureFlag) {
      // Update the newFeatureFlag and addedUsers states with the selected feature flag data
      setNewFeatureFlag({
        name: selectedFeatureFlag.name,
        isEnabled: selectedFeatureFlag.isEnabled,
      });
      setAddedUsers(selectedFeatureFlag.users || []);
    } else {
      // Reset the newFeatureFlag and addedUsers states if the selected feature flag is not found
      setNewFeatureFlag({ name: featureFlagName, isEnabled: false });
      setAddedUsers([]);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeatureFlag({ ...newFeatureFlag, isEnabled: event.target.checked });
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

    if (response.data) {
      fetchFeatureFlags();
      setSelectedUsers([]);
    } else {
      alert('Error updating the feature flag. Please try again.');
    }
  };

  const handleAddUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (!prevSelectedUsers.includes(userId)) {
        const userToAdd = filteredUsers.find((user) => user.id === userId);
        if (userToAdd) {
          setAddedUsers((prevAddedUsers) => [...(prevAddedUsers || []), userToAdd]);
        }
        return [...prevSelectedUsers, userId];
      }
      return prevSelectedUsers;
    });
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    setAddedUsers((prevAddedUsers) => prevAddedUsers.filter((user) => user.id !== userId));
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Gestion des feature flags (restrictions d&apos;accès)</Typography>
      <Typography variant="h6" my={2}>
        Choisir une restriction
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <FormControl>
              <InputLabel>Feature Flag</InputLabel>
              <Select sx={{ minWidth: '10rem' }} label="Feature Flag" name="name" value={newFeatureFlag.name} onChange={handleNewFeatureFlagChange}>
                {FEATURE_FLAGS?.map((flag, index) => (
                  <MenuItem key={index} value={flag}>
                    {flag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControlLabel control={<Checkbox checked={newFeatureFlag.isEnabled} onChange={handleCheckboxChange} />} label="Is Enabled" />
          </Grid>
          <Grid item>
            <TextField label="Filtre utilisateur" placeholder="Filtre utilisateur" value={userFilter} onChange={handleUserFilterChange} />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Appliquer les changements
            </Button>
          </Grid>
        </Grid>
      </form>
      {newFeatureFlag.name && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" my={2}>
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
                      <TableCell>
                        {selectedUsers.includes(user.id) ? (
                          <Button variant="outlined" color="error" onClick={() => handleRemoveUser(user.id)}>
                            -
                          </Button>
                        ) : (
                          <Button variant="outlined" color="success" onClick={() => handleAddUser(user.id)}>
                            +
                          </Button>
                        )}
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
            <Typography variant="h6" my={2}>
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
                  {addedUsers?.map((user) => (
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
