import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useLanguages } from 'src/services/useLanguages';
import type { Language } from 'types/language.type';

type LanguageOption = Language & {
  firstLetter: string;
};

interface LanguageSelectorProps {
  label?: string | React.ReactNode;
  value?: string;
  onChange?(newValue: string): void;
  style?: React.CSSProperties;
}

export const LanguageSelector = ({ label, value = '', onChange, style }: LanguageSelectorProps) => {
  const { languages } = useLanguages();
  const options: LanguageOption[] = React.useMemo(
    () =>
      languages.map((option) => {
        const firstLetter = option.french[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      }),
    [languages],
  );
  const [option, setOption] = React.useState<LanguageOption | null>(null);

  React.useEffect(() => {
    if (value && value.length == 2 && languages.map((c) => c.alpha2).find((c2) => c2.toLowerCase() === value.toLowerCase())) {
      const newOption = options.find((o) => o.alpha2.toLowerCase() === value.toLowerCase()) || null;
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
        onChange(newOption ? newOption.alpha2 : '');
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
      getOptionSelected={(option, value) => option.alpha2 === value.alpha2}
      getOptionLabel={(option) => option.french}
      style={style}
      renderOption={(option) => <>{option.french}</>}
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
