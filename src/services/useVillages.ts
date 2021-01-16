import { useSnackbar } from "notistack";
import { useQueryCache, useQuery, QueryFunction } from "react-query";
import React from "react";

import { UserContext } from "src/contexts/userContext";
import type { Village } from "types/village.type";

export const useVillages = (): { villages: Village[]; setVillages(newVillages: Village[]): void } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryCache = useQueryCache();

  const getVillages: QueryFunction<Village[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/villages`,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Village[], unknown>(["villages"], getVillages);

  const setVillages = React.useCallback(
    (newVillages: Village[]) => {
      queryCache.setQueryData(["villages"], newVillages);
    },
    [queryCache],
  );

  return {
    villages: isLoading || error ? [] : data,
    setVillages,
  };
};

export const useVillageRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();

  const addVillage = React.useCallback(
    async (newVillage: Pick<Village, "name" | "countries">) => {
      const response = await axiosLoggedRequest({
        method: "POST",
        url: "/villages",
        data: newVillage,
      });
      if (response.error) {
        enqueueSnackbar("Une erreur est survenue...", {
          variant: "error",
        });
        return null;
      }
      enqueueSnackbar("Village créé avec succès!", {
        variant: "success",
      });
      queryCache.invalidateQueries("villages");
      return response.data as Village;
    },
    [axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  const editVillage = React.useCallback(
    async (updatedVillage: Village) => {
      const { id, ...rest } = updatedVillage;
      const response = await axiosLoggedRequest({
        method: "PUT",
        url: `/villages/${id}`,
        data: rest,
      });
      if (response.error) {
        enqueueSnackbar("Une erreur est survenue...", {
          variant: "error",
        });
        return null;
      }
      enqueueSnackbar("Village modifié avec succès!", {
        variant: "success",
      });
      queryCache.invalidateQueries("villages");
      return response.data as Village;
    },
    [axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  const deleteVillage = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: "DELETE",
        url: `/villages/${id}`,
      });
      if (response.error) {
        enqueueSnackbar("Une erreur est survenue...", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Village supprimé avec succès!", {
        variant: "success",
      });
      queryCache.invalidateQueries("villages");
    },
    [axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  return {
    addVillage,
    editVillage,
    deleteVillage,
  };
};
