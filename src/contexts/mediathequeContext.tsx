import type { FC, Dispatch, SetStateAction } from 'react';
import React, { createContext, useState } from 'react';

import { useGetMediathequeAll } from 'src/api/mediatheque/mediatheque.all';
import { useGetMediathequeCount } from 'src/api/mediatheque/mediatheque.count';
import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import type { Filter } from 'types/mediatheque.type';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: Array<Filter[]>;
  setFilters: Dispatch<SetStateAction<Array<Filter[]>>>;
  filtered: [];
  setOffset: Dispatch<SetStateAction<number>>;
  count: number;
  allFiltered: [];
};

const MediathequeContext: React.Context<MediathequeContextType> = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  filtered: [],
  setOffset: () => {},
  count: 0,
  allFiltered: [],
});

export const MediathequeProvider: FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  const [offset, setOffset] = useState<number>(0);
  const { data: filtered } = useGetMediatheque(offset, filters);
  const { data: count } = useGetMediathequeCount(filters);
  const { data: allFiltered } = useGetMediathequeAll(filters);

  return (
    <MediathequeContext.Provider value={{ filters, setFilters, filtered, setOffset, count, allFiltered }}>{children}</MediathequeContext.Provider>
  );
};

export default MediathequeContext;
