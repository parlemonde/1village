import React, { createContext, useState, useMemo } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import type { Filter } from 'types/mediatheque.type';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: Array<Filter[]>;
  setFilters: React.Dispatch<React.SetStateAction<Array<Filter[]>>>;
  allFiltered: [];
};

const MediathequeContext = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  allFiltered: [],
});

export const MediathequeProvider: React.FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  console.log("filters :", filters);

  const { data: allData } = useGetMediatheque(filters);
  console.log(allData);

  const activitiesMediaFinder = allData?.map(
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
  );

  const dataFiltered = activitiesMediaFinder;

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      allFiltered: dataFiltered || [],
    }),
    [filters, dataFiltered],
  );

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
