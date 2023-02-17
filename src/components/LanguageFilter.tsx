import type { SxProps, Theme } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

import type { Language } from 'types/language.type';

interface LanguageOption {
  key: string;
  language: Language;
}

interface Props {
  languages: Language[];
  language: string | undefined;
  setLanguage: (language: string | undefined) => void;
  sx?: SxProps<Theme>;
}

const LanguageFilter = ({ languages, language, setLanguage, sx }: Props) => {
  return (
    <Autocomplete
      options={languages.sort((a, b) => a.french.localeCompare(b.french)).map((language, index) => ({ key: index.toString(), language }))}
      getOptionLabel={(option) => option.language?.french ?? ''}
      sx={sx}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value={language ? { key: language, language: languages.find((l) => l.alpha2 === language)! } : undefined}
      disableClearable
      onChange={(_event, newValue: LanguageOption | null) => {
        setLanguage(newValue?.language.alpha2 ?? undefined);
      }}
      renderInput={(params) => <TextField {...params} label="Langue" fullWidth />}
    />
  );
};

export default LanguageFilter;
