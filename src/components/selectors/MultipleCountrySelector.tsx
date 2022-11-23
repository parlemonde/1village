import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React from 'react';

import { useCountries } from 'src/services/useCountries';
import type { Country } from 'types/country.type';

type CountryOption = Country & {
  firstLetter: string;
};

interface MultipleCountrySelectorProps {
  label: string | React.ReactNode;
  value?: string[];
  onChange?(newValue: string[] | null): void;
  filterCountries?: string[];
  style?: React.CSSProperties;
  helperText?: React.ReactNode;
  error?: boolean;
}

export const MultipleCountrySelector = ({ label, value = [], onChange, filterCountries, style, helperText, error }: MultipleCountrySelectorProps) => {
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

  const [option, setOption] = React.useState<CountryOption[]>([]);
  React.useEffect(() => {
    const newOption = options.filter((o) => value.includes(o.isoCode)) || null;
    setOption(newOption);
  }, [options, value]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: CountryOption[]) => {
      if (!value) {
        setOption(newOption);
      }
      if (onChange) {
        onChange(newOption ? newOption.map((o) => o.isoCode) : null);
      }
    },
    [value, onChange],
  );

  return (
    <Autocomplete
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      style={style}
      value={option}
      getOptionLabel={(option) => option.name}
      onChange={onChangeOption}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          variant="outlined"
          label={label}
          type="search"
          helperText={helperText}
          error={error}
        />
      )}
      autoHighlight
      blurOnSelect
      multiple
    />
  );
};
