import React, { createContext, useState, useMemo, useEffect } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
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
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  updatePageKey: number;
  setUpdatePageKey: React.Dispatch<React.SetStateAction<number>>;
};

interface UserData {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  subType: number;
  type: number;
  villageId: number;
  userId: number;
  user: { type: number; school: string };
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
}

const MediathequeContext = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  allFiltered: [],
  useAdminData: false,
  setUseAdminData: () => {},
  page: 0,
  setPage: () => {},
  updatePageKey: 0,
  setUpdatePageKey: () => {},
});

export const MediathequeProvider: React.FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  const [useAdminData, setUseAdminData] = useState(false);

  const { data: usersData } = useGetMediatheque(filters);
  const [dataToUse, setDataToUse] = useState<[]>([]);

  const [page, setPage] = useState<number>(0);
  const [updatePageKey, setUpdatePageKey] = useState(0);

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
          village: { name: string };
        } = { id, subType, type, villageId, userId, content: [], user, village };
        if (type === 8 || type === 12 || type === 13 || type === 14) {
          if (type === 8) {
            result.content.push({ type: 'image', value: data.mascotteImage });
          }
          if (type === 12) {
            result.content.push({ type: 'sound', value: data.verseFinalMixUrl });
            // result.content.push({ type: 'sound', value: data.verseMixUrl });
            // result.content.push({ type: 'sound', value: data.verseMixWithIntroUrl });
            // result.content.push({ type: 'sound', value: data.verseMixWithVocalsUrl });
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

    const activitiesWithMediaOnly = activitiesMediaFinder?.filter((a: UserData) => a.content.length > 0);
    const activitiesFromPelico = activitiesWithMediaOnly?.filter((a: UserData) => [0, 1, 2].includes(a.user.type));

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
      page,
      setPage,
      updatePageKey,
      setUpdatePageKey,
    }),
    [filters, dataToUse, useAdminData, page, updatePageKey],
  );

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
