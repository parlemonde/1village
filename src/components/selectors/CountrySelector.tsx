import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useCountries } from 'src/services/useCountries';
import { countryToFlag } from 'src/utils';
import type { Country } from 'types/country.type';

type CountryOption = Country & {
  firstLetter: string;
};

interface CountrySelectorProps {
  label: string | React.ReactNode;
  value?: string;
  onChange?(newValue: string): void;
  filterCountries?: string[];
  style?: React.CSSProperties;
}

export const CountrySelector = ({ label, value = '', onChange, filterCountries, style }: CountrySelectorProps) => {
  const { countries } = useCountries();
  const options: CountryOption[] = React.useMemo(
    () =>
      countries
        .filter(filterCountries ? (c) => filterCountries.find((c2) => c2.toLowerCase() === c.isoCode.toLowerCase()) : () => true)
        .map((option) => {
          const firstLetter = option.name[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
          };
        }),
    [countries, filterCountries],
  );
  const [option, setOption] = React.useState<CountryOption | null>(null);

  const prevFilter = React.useRef<string[]>(filterCountries);
  React.useEffect(() => {
    const shouldUpdateValue = (prevFilter.current || []).join(',') !== (filterCountries || []).join(',');
    if (shouldUpdateValue) {
      prevFilter.current = filterCountries;
    }

    if (value && value.length == 2 && (filterCountries || countries.map((c) => c.isoCode)).find((c2) => c2.toLowerCase() === value.toLowerCase())) {
      const newOption = options.find((o) => o.isoCode.toLowerCase() === value.toLowerCase()) || null;
      setOption(newOption);
      if (shouldUpdateValue && onChange) {
        onChange(newOption.isoCode || '');
      }
    } else {
      setOption(null);
      if (shouldUpdateValue && onChange) {
        onChange('');
      }
    }
  }, [options, value, countries, filterCountries, onChange]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: CountryOption | null) => {
      if (!value) {
        setOption(newOption);
      }
      if (onChange) {
        onChange(newOption ? newOption.isoCode : '');
      }
    },
    [value, onChange],
  );

  return (
    <Autocomplete
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      value={option}
      onChange={onChangeOption}
      getOptionSelected={(option, value) => option.isoCode === value.isoCode}
      getOptionLabel={(option) => option.name}
      style={style}
      renderOption={(option) => (
        <>
          <span style={{ marginRight: '0.6rem' }}>{countryToFlag(option.isoCode)}</span>
          {option.name}
        </>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          label={label}
          type="search"
        />
      )}
      autoHighlight
      blurOnSelect
    />
  );
};
