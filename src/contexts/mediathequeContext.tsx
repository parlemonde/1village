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
  filtered: [];
};

const MediathequeContext: React.Context<MediathequeContextType> = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  filtered: [],
});

export const MediathequeProvider: FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  const offset = 0;
  const { data: filtered } = useGetMediatheque(offset, filters);

  return <MediathequeContext.Provider value={{ filters, setFilters, filtered }}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
