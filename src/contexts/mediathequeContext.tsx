import type { FC, Dispatch, SetStateAction } from 'react';
import React, { createContext, useState } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import type { Filter } from 'types/mediatheque.type';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: Array<Filter[]>;
  setFilters: Dispatch<SetStateAction<Array<Filter[]>>>;
  offset: number;
  filtered: [];
  setOffset: Dispatch<SetStateAction<number>>;
  count: number;
  allFiltered: [];
};

const MediathequeContext: React.Context<MediathequeContextType> = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  filtered: [],
  offset: 0,
  setOffset: () => {},
  count: 0,
  allFiltered: [],
});

export const MediathequeProvider: FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  const [offset, setOffset] = useState<number>(0);

  // const { data } = useGetMediatheque(filters, offset, 6);
  // console.log(data);
  const { data: allData } = useGetMediatheque(filters);
  console.log('allData : ', allData);

  if (!allData) {
    return null;
  }
  return (
    <MediathequeContext.Provider
      value={{
        filters,
        // offset: data?.offset,
        setFilters,
        // filtered: data?.activities,
        setOffset,
        // count: allData?.activities?.length,
        allFiltered: allData?.activities,
      }}
    >
      {children}
    </MediathequeContext.Provider>
  );
};

export default MediathequeContext;
