import React, { createContext, useState, useMemo, useEffect } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import type { Filter } from 'types/mediatheque.type';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: Array<Filter[]>;
  setFilters: React.Dispatch<React.SetStateAction<Array<Filter[]>>>;
  allFiltered: any[];
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
  const [useAdminData, setUseAdminData] = useState(false);

  const { data: usersData } = useGetMediatheque(filters);
  const [dataToUse, setDataToUse] = useState<any[]>([]);

  useEffect(() => {
    const activitiesMediaFinder = usersData
      ?.filter(({ type }: { type: number }) => ![3, 5, 11].includes(type))
      .map(
        ({
          id,
          content,
          subType,
          type,
          villageId,
          userId,
          user,
          village,
          data,
        }: {
          id: number;
          content: object;
          subType: number;
          type: number;
          villageId: number;
          userId: number;
          user: object;
          village: object;
          data: object;
        }) => {
          const result = { id, subType, type, villageId, userId, content: [], user, village };
          if (type === 8 || type === 12 || type === 13 || type === 14) {
            if (type === 8) {
              result.content.push({ type: 'image', value: data.mascotteImage });
            }
            if (type === 12) {
              result.content.push({ type: 'sound', value: data.verseFinalMixUrl });
              result.content.push({ type: 'sound', value: data.verseMixUrl });
              result.content.push({ type: 'sound', value: data.verseMixWithIntroUrl });
              result.content.push({ type: 'sound', value: data.verseMixWithVocalsUrl });
            }
            if (type === 13 || type === 14) {
              const properties = ['odd', 'object', 'place', 'tale'];

              properties.forEach((prop) => {
                if (prop === 'tale') {
                  result.content.push({ type: 'image', value: data[prop].imageStory });
                } else {
                  result.content.push({ type: 'image', value: data[prop].imageUrl });
                }
              });
            }
          }
          if (content.game) {
            content.game.map(({ inputs }) =>
              inputs.map((input: { type: number; selectedValue: string }) => {
                if (input.type === 3 || input.type === 4) {
                  result.content.push({ type: input.type === 3 ? 'image' : 'video', value: input.selectedValue });
                }
              }),
            );
          } else {
            content.map(({ type, value }: { type: string; value: string }) => {
              const wantedTypes = ['image', 'video', 'sound'];
              if (wantedTypes.includes(type)) {
                result.content.push({ type, value });
              }
            });
          }
          return result;
        },
      );

    console.log('activitiesMediaFinder', activitiesMediaFinder);

    const activitiesWithMediaOnly = activitiesMediaFinder?.filter((a) => a.content.length > 0);
    const activitiesFromPelico = activitiesWithMediaOnly?.filter((a) => [0, 1, 2].includes(a.user.type));

    if (useAdminData) {
      setDataToUse(activitiesFromPelico || []);
    } else {
      setDataToUse(activitiesWithMediaOnly || []);
    }
  }, [usersData, useAdminData]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      allFiltered: dataToUse,
      useAdminData,
      setUseAdminData,
    }),
    [filters, dataToUse, useAdminData],
  );

  console.log('data to use = ', dataToUse);

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
