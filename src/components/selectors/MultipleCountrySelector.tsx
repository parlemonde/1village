import React from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useCountries } from 'src/services/useCountries';
import { Country } from 'types/country.type';

type CountryOption = Country & {
  firstLetter: string;
};

interface MultipleCountrySelectorProps {
  label: string | React.ReactNode;
  value?: string;
  onChange?(newValue: string[] | null): void;
  filterCountries?: string[];
  style?: React.CSSProperties;
}

export const MultipleCountrySelector: React.FC<MultipleCountrySelectorProps> = ({
  label,
  value = '',
  onChange,
  filterCountries,
  style,
}: MultipleCountrySelectorProps) => {
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

  const [option, setOption] = React.useState<CountryOption[] | null>([]);
  React.useEffect(() => {
    const newOption = options.filter((o) => value.includes(o.isoCode)) || null;
    setOption(newOption);
  }, [options, value, countries, filterCountries, onChange]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: CountryOption[] | null) => {
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
          label={label}
          type="search"
        />
      )}
      autoHighlight
      blurOnSelect
      multiple
    />
  );
};
