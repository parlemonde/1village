import React from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useCountries } from "src/services/useCountries";
import { countryToFlag } from "src/utils";
import { Country } from "types/country.type";

type CountryOption = Country & {
  firstLetter: string;
};

interface CountrySelectorProps {
  label: string;
  value?: string;
  onChange?(newValue: string): void;
  style?: React.CSSProperties;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ label, value = "", onChange, style }: CountrySelectorProps) => {
  const { countries } = useCountries();
  const options: CountryOption[] = React.useMemo(
    () =>
      countries.map((option) => {
        const firstLetter = option.name[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
          ...option,
        };
      }),
    [countries],
  );
  const [option, setOption] = React.useState<CountryOption | null>(null);

  React.useEffect(() => {
    if (value && value.length == 2) {
      const newOption = options.find((o) => o.isoCode.toLowerCase() === value.toLowerCase()) || null;
      setOption(newOption);
    } else {
      setOption(null);
    }
  }, [options, value]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: CountryOption | null) => {
      if (!value) {
        setOption(newOption);
      }
      if (onChange) {
        onChange(newOption ? newOption.isoCode : "");
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
          <span style={{ marginRight: "0.6rem" }}>{countryToFlag(option.isoCode)}</span>
          {option.name}
        </>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
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
