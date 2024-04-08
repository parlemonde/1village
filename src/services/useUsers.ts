import { useSnackbar } from 'notistack';
import React from 'react';
import { useQueryClient } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { User, UserUpdatePassword } from 'types/user.type';

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
      if (response.data.message) {
        if (response.data.message.includes('Duplicate entry')) {
          enqueueSnackbar('Une erreur est survenue...', {
            variant: 'error',
          });
          return Promise.reject(new Error('Duplicate Entry'));
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

  const editUserPassword = React.useCallback(
    async (updatedUser: Partial<UserUpdatePassword>) => {
      const { email, password, verificationHash } = updatedUser;
      const response = await axiosRequest({
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

  const verifyUser = React.useCallback(
    async (email: string, verificationHash: string) => {
      const response = await axiosRequest({
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
    [queryClient, enqueueSnackbar],
  );

  const resendVerificationEmail = React.useCallback(
    async (email: string) => {
      const response = await axiosRequest({
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
    [queryClient, enqueueSnackbar],
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
