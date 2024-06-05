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

  const { data: allData } = useGetMediatheque(filters);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      allFiltered: allData || [],
    }),
    [filters, allData],
  );

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
