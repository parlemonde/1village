import React, { createContext, useState, useMemo, useEffect } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import { useGetOnlyPelicoMediatheque } from 'src/api/mediatheque/mediatheque.get-only-pelico';
import type { Filter } from 'types/mediatheque.type';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: Array<Filter[]>;
  setFilters: React.Dispatch<React.SetStateAction<Array<Filter[]>>>;
  allFiltered: [];
  useAdminData: boolean;
  setUseAdminData: React.Dispatch<React.SetStateAction<boolean>>;
};

const MediathequeContext = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  allFiltered: [],
  useAdminData: false,
  setUseAdminData: () => {},
});

export const MediathequeProvider: React.FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  console.log('filters :', filters);
  const [useAdminData, setUseAdminData] = useState(false);

  const { data: usersData } = useGetMediatheque(filters);
  const { data: pelicoData } = useGetOnlyPelicoMediatheque(filters);
  console.log('usersData', usersData);
  console.log('pelicoData', pelicoData);
  const [dataToUse, setDataToUse] = useState([]);
  const [dataToDisplay, setDataToDisplay] = useState([]);

  useEffect(() => {
    if (useAdminData === true) {
      setDataToUse(pelicoData);
    } else {
      setDataToUse(usersData);
    }
  }, [pelicoData, useAdminData, usersData]);

  console.log('dataToUse = ', dataToUse);

  const activitiesMediaFinder = Array.isArray(dataToUse)
    ? dataToUse.map(
        ({
          id,
          content,
          subType,
          type,
          villageId,
          userId,
        }: {
          id: number;
          content: object;
          subType: number;
          type: number;
          villageId: number;
          userId: number;
        }) => {
          const result = { id, subType, type, villageId, userId, content: [] };
          if (content.game) {
            content.game.map(({ inputs }) =>
              inputs.map((input: { type: number; selectedValue: string }) => {
                if (input.type === 3 || input.type === 4) {
                  result.content.push({ type: input.type === 3 ? 'image' : 'video', value: input.selectedValue });
                }
              }),
            );
          } else {
            content.map(({ type, value }) => {
              const wantedTypes = ['image', 'video', 'sound'];
              if (wantedTypes.includes(type)) {
                result.content.push({ type, value });
              }
            });
          }
          return result;
        },
      )
    : [];

  const dataFiltered = activitiesMediaFinder;
  console.log("Les datas filtrées ======== ", dataFiltered)

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      allFiltered: dataFiltered || [],
      useAdminData,
      setUseAdminData,
    }),
    [filters, dataFiltered, useAdminData],
  );

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
