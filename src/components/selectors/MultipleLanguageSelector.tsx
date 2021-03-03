import React from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLanguages } from 'src/services/useLanguages';
import { Language } from 'types/language.type';

type LanguageOption = Language & {
  firstLetter: string;
};

interface MultipleLanguageSelectorProps {
  label: string | React.ReactNode;
  value?: string[];
  onChange?(newValue: string[] | null): void;
  filterLanguages?: string[];
  style?: React.CSSProperties;
}

export const MultipleLanguageSelector: React.FC<MultipleLanguageSelectorProps> = ({
  label,
  value = [],
  onChange,
  filterLanguages,
  style,
}: MultipleLanguageSelectorProps) => {
  const { languages } = useLanguages();
  const options: LanguageOption[] = React.useMemo(
    () =>
      languages
        .filter(filterLanguages ? (c) => filterLanguages.find((c2) => c2.toLowerCase() === c.alpha3_b.toLowerCase()) : () => true)
        .map((option) => {
          const firstLetter = option.french[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
          };
        }),
    [languages, filterLanguages],
  );

  const [option, setOption] = React.useState<LanguageOption[] | null>([]);
  React.useEffect(() => {
    const newOption = options.filter((o) => value.includes(o.alpha3_b)) || null;
    setOption(newOption);
  }, [options, value, languages, filterLanguages, onChange]);

  const onChangeOption = React.useCallback(
    (_event: React.ChangeEvent<unknown>, newOption: LanguageOption[] | null) => {
      if (!value) {
        setOption(newOption);
      }
      if (onChange) {
        onChange(newOption ? newOption.map((o) => o.alpha3_b) : null);
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
      getOptionLabel={(option) => option.french}
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
