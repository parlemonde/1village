import { useSnackbar } from 'notistack';
import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { UserContext } from 'src/contexts/userContext';
import type { User, UserUpdatePassword } from 'types/user.type';

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
    users: isLoading || error ? [] : data || [],
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
      const { country, ...u } = newUser;
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/users',
        data: {
          ...u,
          countryCode: country?.isoCode,
        },
      });
      if (response.data.message) {
        if (response.data.message.includes('Duplicate entry')) {
          enqueueSnackbar('Une erreur est survenue...', {
            variant: 'error',
          });
          return Promise.reject(new Error('Email already exists'));
        }
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
      const { id, country, ...rest } = updatedUser;
      const response = await axiosLoggedRequest({
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
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const editUserPassword = React.useCallback(
    async (updatedUser: Partial<UserUpdatePassword>) => {
      const { email, password, verificationHash } = updatedUser;
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: `/users/update-password`,
        data: { email: email, password: password, verificationHash: verificationHash },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      enqueueSnackbar('Mot de passe modifié avec succès!', {
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

  const verifyUser = React.useCallback(
    async (email: string, verificationHash: string) => {
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/users/verify-email',
        data: {
          email: email,
          verificationHash: verificationHash,
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        throw new Error('invalid token');
      }
      enqueueSnackbar('Utilisateur verifié avec succès', {
        variant: 'success',
      });
      queryClient.invalidateQueries('users');
      return response.data.user as User;
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const resendVerificationEmail = React.useCallback(
    async (email: string) => {
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/users/resend-verification-email',
        data: {
          email: email,
        },
      });
      if (response.data.message) {
        if (response.data.message.includes('Bad request')) {
          enqueueSnackbar('Une erreur est survenue...', {
            variant: 'error',
          });
          return Promise.reject(new Error('Email already exists'));
        }

        return null;
      }
      enqueueSnackbar('Email envoyé avec succès', {
        variant: 'success',
      });
      queryClient.invalidateQueries('users');
      return response.data as User;
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  return {
    addUser,
    editUser,
    editUserPassword,
    deleteUser,
    verifyUser,
    resendVerificationEmail,
  };
};
