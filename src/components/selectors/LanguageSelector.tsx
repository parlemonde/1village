import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

import { useLanguages } from 'src/services/useLanguages';
import type { Language } from 'types/language.type';

type LanguageOption = Language & {
  firstLetter: string;
};

interface LanguageSelectorProps {
  label?: string | React.ReactNode;
  value?: string;
  onChange?(newValue: string): void;
  filterLanguages?: string[];
  style?: React.CSSProperties;
}

export const LanguageSelector = ({ label, value = '', onChange, filterLanguages, style }: LanguageSelectorProps) => {
  const { languages } = useLanguages();
  const options: LanguageOption[] = React.useMemo(
    () =>
      languages
        .filter(filterLanguages ? (c) => filterLanguages.find((c3) => c3.toLowerCase() === c.alpha3_b.toLowerCase()) : () => true)
        .map((option) => {
          const firstLetter = option.french[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
          };
        }),
    [filterLanguages, languages],
  );
  const [option, setOption] = React.useState<LanguageOption | null>(null);

  React.useEffect(() => {
    if (value && value.length == 3 && languages.map((c) => c.alpha3_b).find((c2) => c2.toLowerCase() === value.toLowerCase())) {
      const newOption = options.find((o) => o.alpha3_b.toLowerCase() === value.toLowerCase()) || null;
      setOption(newOption);
    } else {
      setOption(null);
    }
  }, [options, value, languages]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: LanguageOption | null) => {
      if (!value) {
        setOption(newOption);
      }
      if (onChange) {
        onChange(newOption ? newOption.alpha3_b : '');
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
      isOptionEqualToValue={(option, value) => option.alpha3_b === value.alpha3_b}
      getOptionLabel={(option) => option.french}
      style={style}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.french}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          variant="standard"
          label={label}
          type="search"
        />
      )}
      autoHighlight
      blurOnSelect
    />
  );
};
