import { useSnackbar } from 'notistack';
import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Village, VillageFilter } from 'types/village.type';

export const useVillages = (options?: VillageFilter): { villages: Village[]; setVillages(newVillages: Village[]): void } => {
  const queryClient = useQueryClient();
  const buildUrl = () => {
    if (!options) return '/villages';
    const { countryIsoCode } = options;
    const queryParams = [];

    if (countryIsoCode) queryParams.push(`countryIsoCode=${countryIsoCode}`);

    return queryParams.length ? `/villages?${queryParams.join('&')}` : '/villages';
  };

  const url = buildUrl();
  // The query function for fetching villages, memoized with useCallback
  const getVillages: QueryFunction<Village[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [url]);

  // Notice that we include `countryIsoCode` in the query key so that the query is refetched
  const { data, isLoading, error } = useQuery<Village[], unknown>(
    ['villages', options], // Include countryIsoCode in the query key to trigger refetching
    getVillages,
  );

  const setVillages = React.useCallback(
    (newVillages: Village[]) => {
      queryClient.setQueryData(['villages', options], newVillages); // Ensure that the query key includes countryIsoCode
    },
    [queryClient, options],
  );

  return {
    villages: isLoading || error ? [] : data || [],
    setVillages,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useVillageRequests = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const addVillage = React.useCallback(
    async (newVillage: Pick<Village, 'name' | 'countries'>) => {
      const response = await axiosRequest({
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
    [queryClient, enqueueSnackbar],
  );

  const editVillage = React.useCallback(
    async (updatedVillage: Partial<Village>) => {
      const { id, ...rest } = updatedVillage;
      const response = await axiosRequest({
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
    [queryClient, enqueueSnackbar],
  );

  const deleteVillage = React.useCallback(
    async (id: number) => {
      const response = await axiosRequest({
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
    [queryClient, enqueueSnackbar],
  );

  const importVillages = React.useCallback(async () => {
    const response = await axiosRequest({
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
  }, [queryClient, enqueueSnackbar]);

  return {
    addVillage,
    editVillage,
    deleteVillage,
    importVillages,
  };
};
