import React, { createContext, useState, useMemo, useEffect } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import { useGetVillages } from 'src/api/villages/villages.get';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: object;
  setFilters: React.Dispatch<React.SetStateAction<object>>;
  setAllFiltered: React.Dispatch<React.SetStateAction<[]>>;
  allFiltered: [];
  useAdminData: boolean;
  setUseAdminData: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  updatePageKey: number;
  setUpdatePageKey: React.Dispatch<React.SetStateAction<number>>;
  villageMondes: string[] | undefined;
  allActivities: [];
};

export type UserData = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  countries: { isoCode: string; name: string }[];
  subType: number;
  type: number;
  villageId: number;
  userId: number;
  user: { type: number; school: string; country: { isoCode: string; name: string } };
  village: { name: string };
  data: {
    mascotteImage?: string;
    verseFinalMixUrl?: string;
    verseMixUrl?: string;
    verseMixWithIntroUrl?: string;
    verseMixWithVocalsUrl?: string;
    odd?: { imageStory?: string; imageUrl?: string };
    object?: { imageStory?: string; imageUrl?: string };
    place?: { imageStory?: string; imageUrl?: string };
    tale?: { imageStory?: string; imageUrl?: string };
  };
};

const MediathequeContext = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  allFiltered: [],
  setAllFiltered: () => {},
  useAdminData: false,
  setUseAdminData: () => {},
  page: 0,
  setPage: () => {},
  updatePageKey: 0,
  setUpdatePageKey: () => {},
  villageMondes: [],
  allActivities: [],
});

export const MediathequeProvider: React.FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [useAdminData, setUseAdminData] = useState(false);
  const [allFiltered, setAllFiltered] = useState<[]>([]);

  const { data: usersData } = useGetMediatheque();
  const [dataToUse, setDataToUse] = useState<[]>([]);

  const [page, setPage] = useState<number>(0);
  const [updatePageKey, setUpdatePageKey] = useState(0);

  const { data: villages } = useGetVillages();
  const [villageMondes, setvillageMondes] = useState<string[]>();

  useEffect(() => {
    setvillageMondes(villages?.map(({ name }: { name: string }) => name) || []);
  }, [villages]);

  useEffect(() => {
    const activitiesMediaFinder = usersData
      ?.filter(({ type }: { type: number }) => ![3, 5, 11].includes(type))
      .map(({ id, content, subType, type, villageId, userId, user, village, data }: UserData) => {
        const result: {
          id: number;
          subType: number;
          type: number;
          villageId: number;
          userId: number;
          content: Array<{ type: string; value: string | undefined }>;
          user: { type: number; school: string };
          village: { name: string; countryCodes?: string };
        } = { id, subType, type, villageId, userId, content: [], user, village };
        if (type === 8 || type === 12 || type === 13 || type === 14) {
          if (type === 8) {
            result.content.push({ type: 'image', value: data.mascotteImage });
          }
          if (type === 12) {
            result.content.push({ type: 'sound', value: data.verseFinalMixUrl });
          }
          if (type === 13 || type === 14) {
            const properties = ['odd', 'object', 'place', 'tale'];

            properties.forEach((prop: string) => {
              const propData = data[prop as keyof typeof data];
              if (typeof propData === 'object' && propData !== null) {
                if (prop === 'tale') {
                  result.content.push({ type: 'image', value: propData.imageStory });
                } else {
                  result.content.push({ type: 'image', value: propData.imageUrl });
                }
              }
            });
          }
        }
        if (content.game) {
          content.game.map(({ inputs }: { inputs: Array<{ type: number; selectedValue: string }> }) =>
            inputs.map((input) => {
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
      });

    activitiesMediaFinder?.forEach((_a: { village: object }, index: number) => {
      if (activitiesMediaFinder[index].village) {
        Object.keys(activitiesMediaFinder[index].village).forEach((k) => (activitiesMediaFinder[index][k] = activitiesMediaFinder[index].village[k]));
        delete activitiesMediaFinder[index].village;
      }
    });

    const activitiesWithMediaOnly = activitiesMediaFinder?.filter((a: UserData) => a.content.length > 0);
    const activitiesFromPelico = activitiesWithMediaOnly?.filter((a: UserData) => [0, 1, 2].includes(a.user.type));

    if (useAdminData) {
      setDataToUse(activitiesFromPelico || []);
      setAllFiltered(activitiesFromPelico || []);
    } else {
      setDataToUse(activitiesWithMediaOnly || []);
      setAllFiltered(activitiesWithMediaOnly || []);
    }
  }, [usersData, useAdminData]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      allFiltered,
      allActivities: dataToUse,
      setAllFiltered,
      useAdminData,
      setUseAdminData,
      page,
      setPage,
      updatePageKey,
      setUpdatePageKey,
      villageMondes,
    }),
    [filters, allFiltered, dataToUse, useAdminData, page, updatePageKey, villageMondes],
  );

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
