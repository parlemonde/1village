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
  setOffset: Dispatch<SetStateAction<number>>;
  allFiltered: [];
};

const MediathequeContext: React.Context<MediathequeContextType> = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  setOffset: () => {},
  allFiltered: [],
});

export const MediathequeProvider: FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  const [, setOffset] = useState<number>(0);

  const { data: allData } = useGetMediatheque(filters);
  console.log('allData : ', allData);

  if (!allData) {
    return null;
  }
  return (
    <MediathequeContext.Provider
      value={{
        filters,
        setFilters,
        setOffset,
        allFiltered: allData,
      }}
    >
      {children}
    </MediathequeContext.Provider>
  );
};

export default MediathequeContext;
