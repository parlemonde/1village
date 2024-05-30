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
  // const r = useGetMediatheque(filters, offset, 2);
  // console.log(r);
  const { data } = useGetMediatheque(filters, offset, 6);
  console.log(data);

  if (!data) {
    return null;
  }
  // const {
  //  data: { activities: filtered, offset: newOffset },
  // } = useGetMediatheque(filters, offset, 6);
  // const { data: count } = useGetMediathequeCount(filters);

  // const {
  //   data: { activities: allFiltered },
  // } = useGetMediatheque(filters);

  return (
    <MediathequeContext.Provider
      value={{
        filters,
        offset: data?.newOffset,
        setFilters,
        filtered: data?.activities,
        setOffset,
        count: data?.activities?.length,
        allFiltered: data?.activities,
      }}
    >
      {/* <MediathequeContext.Provider value={{ filters, offset: 0, setFilters, filtered: [], setOffset, count: 12, allFiltered: [] }}> */}
      {children}
    </MediathequeContext.Provider>
  );
};

export default MediathequeContext;