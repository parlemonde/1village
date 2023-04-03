import { useSnackbar } from 'notistack';
import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';

export const useUsers = (): { users: User[]; setUsers(newUsers: User[]): void } => {
  const queryClient = useQueryClient();

  const getUsers: QueryFunction<User[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/users',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, []);
  const { data, isLoading, error } = useQuery<User[], unknown>(['users'], getUsers);

  const setUsers = React.useCallback(
    (newUsers: User[]) => {
      queryClient.setQueryData(['users'], newUsers);
    },
    [queryClient],
  );

  return {
    users: isLoading || error ? [] : data || [],
    setUsers,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUserRequests = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const addUser = React.useCallback(
    async (newUser: Partial<Omit<User, 'id'>>) => {
      const { country, ...u } = newUser;
      const response = await axiosRequest({
        method: 'POST',
        url: '/users',
        data: {
          ...u,
          countryCode: country?.isoCode,
        },
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
    [queryClient, enqueueSnackbar],
  );

  const editUser = React.useCallback(
    async (updatedUser: Partial<User>) => {
      const { id, country, ...rest } = updatedUser;
      const response = await axiosRequest({
        method: 'PUT',
        url: `/users/${id}`,
        data: { ...rest, countryCode: country?.isoCode ?? undefined },
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
    [queryClient, enqueueSnackbar],
  );

  const deleteUser = React.useCallback(
    async (id: number) => {
      const response = await axiosRequest({
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
    [queryClient, enqueueSnackbar],
  );

  return {
    addUser,
    editUser,
    deleteUser,
  };
};
