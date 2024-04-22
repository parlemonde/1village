import type { ReactNode } from 'react';
import React, { useCallback, createContext, useState } from 'react';
import type { Country } from 'server/entities/country';

import { CircularProgress } from '@mui/material';

import { useGetCountries } from 'src/api/countries/countries.get';

interface CountryContextValue {
  countries: Country[];
}
export const CountryContext = createContext<CountryContextValue>({
  countries: [],
});

interface Props {
  children?: ReactNode;
}
export function CountryContextProvider({ children }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const countriesFetch = useGetCountries();
  useCallback(() => {
    if (countriesFetch.data) setCountries(countriesFetch.data);
  }, [countriesFetch.data]);
  if (countriesFetch.isLoading || countriesFetch.isIdle) {
    return <CircularProgress />;
  }
  return <CountryContext.Provider value={{ countries }}>{children}</CountryContext.Provider>;
}
