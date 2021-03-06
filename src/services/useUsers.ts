import { useSnackbar } from 'notistack';
import { useQueryClient, useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { User } from 'types/user.type';

export const useUsers = (): { users: User[]; setUsers(newUsers: User[]): void } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();

  const getUsers: QueryFunction<User[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/users',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<User[], unknown>(['users'], getUsers);

  const setUsers = React.useCallback(
    (newUsers: User[]) => {
      queryClient.setQueryData(['users'], newUsers);
    },
    [queryClient],
  );

  return {
    users: isLoading || error ? [] : data,
    setUsers,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUserRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const addUser = React.useCallback(
    async (newUser: Partial<Omit<User, 'id'>>) => {
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/users',
        data: newUser,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      enqueueSnackbar('Utilisateur créé avec succès!', {
        variant: 'success',
      });
      queryClient.invalidateQueries('users');
      return response.data as User;
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const editUser = React.useCallback(
    async (updatedUser: Partial<User>) => {
      const { id, ...rest } = updatedUser;
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/users/${id}`,
        data: rest,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      enqueueSnackbar('Utilisateur modifié avec succès!', {
        variant: 'success',
      });
      queryClient.invalidateQueries('users');
      return response.data as User;
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const deleteUser = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: 'DELETE',
        url: `/users/${id}`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar('Utilisateur supprimé avec succès!', {
        variant: 'success',
      });
      queryClient.invalidateQueries('users');
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  return {
    addUser,
    editUser,
    deleteUser,
  };
};
