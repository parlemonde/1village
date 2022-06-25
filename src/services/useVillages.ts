import { useSnackbar } from 'notistack';
import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { UserContext } from 'src/contexts/userContext';
import type { Village } from 'types/village.type';

export const useVillages = (): { villages: Village[]; setVillages(newVillages: Village[]): void } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();

  const getVillages: QueryFunction<Village[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/villages',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Village[], unknown>(['villages'], getVillages);

  const setVillages = React.useCallback(
    (newVillages: Village[]) => {
      queryClient.setQueryData(['villages'], newVillages);
    },
    [queryClient],
  );

  return {
    villages: isLoading || error ? [] : data || [],
    setVillages,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useVillageRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const addVillage = React.useCallback(
    async (newVillage: Pick<Village, 'name' | 'countries'>) => {
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/villages',
        data: {
          name: newVillage.name,
          countries: newVillage.countries.map((c) => c.isoCode),
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      enqueueSnackbar('Village créé avec succès!', {
        variant: 'success',
      });
      queryClient.invalidateQueries('villages');
      return response.data as Village;
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const editVillage = React.useCallback(
    async (updatedVillage: Partial<Village>) => {
      const { id, ...rest } = updatedVillage;
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/villages/${id}`,
        data: {
          activePhase: rest.activePhase,
          countries: rest.countries?.map((c) => c.isoCode) || undefined,
          name: rest.name,
          anthemId: rest.anthemId,
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      enqueueSnackbar('Village modifié avec succès!', {
        variant: 'success',
      });
      queryClient.invalidateQueries('villages');
      return response.data as Village;
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const deleteVillage = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: 'DELETE',
        url: `/villages/${id}`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar('Village supprimé avec succès!', {
        variant: 'success',
      });
      queryClient.invalidateQueries('villages');
    },
    [axiosLoggedRequest, queryClient, enqueueSnackbar],
  );

  const importVillages = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'POST',
      url: '/villages/import/plm',
    });
    if (response.error) {
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar(
      response.data.count === 0
        ? 'Aucun nouveau village importé!'
        : response.data.count === 1
        ? '1 village importé avec succès!'
        : `${response.data.count} villages importés avec succès!`,
      {
        variant: 'success',
      },
    );
    queryClient.invalidateQueries('villages');
  }, [axiosLoggedRequest, queryClient, enqueueSnackbar]);

  return {
    addVillage,
    editVillage,
    deleteVillage,
    importVillages,
  };
};
