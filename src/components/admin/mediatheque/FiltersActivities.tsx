/* eslint-disable prettier/prettier */
import React from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import {
  activitiesLabel,
  themeOfDefi,
  themeOfEnigme,
  themeOfIndiceCulturel,
  themeOfIndiceSymbolique,
  themeOfJeux,
} from 'src/config/mediatheque/dataFilters';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(label: string, labelName: readonly string[], theme: Theme) {
  return {
    fontWeight: labelName.indexOf(label) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const subThemesMap: { [key: string]: string[] }  = {
  'Indice culturel': themeOfIndiceCulturel,
  'Indice symbolique': themeOfIndiceSymbolique,
  'Défis': themeOfDefi,
  'Jeux': themeOfJeux,
  'Enigme': themeOfEnigme,
};

export default function FiltersActivities() {
  const theme = useTheme();
  const [labelNameActivity, setLabelNameActivity] = React.useState<string[]>([]);
  const [labelNameSubTheme, setLabelNameSubTheme] = React.useState<string[]>([]);

  const handleChangeLabelActivity = (event: SelectChangeEvent<typeof labelNameActivity>) => {
    const {
      target: { value },
    } = event;
    setLabelNameActivity(typeof value === 'string' ? value.split(',') : value);
    setLabelNameSubTheme([]);
  };

  const subThemes = labelNameActivity.map((activity) => subThemesMap[activity] || []).flat();

  return (
    <>
      <div>
        {/* Filtre pour activités */}
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            multiple
            displayEmpty
            value={labelNameActivity}
            onChange={handleChangeLabelActivity}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Activités</em>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {activitiesLabel.map((label: string, index: number) => (
              <MenuItem key={index} value={label} style={getStyles(label, labelNameActivity, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* Filtres pour sous thème d'une activité */}
      <div>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            multiple
            displayEmpty
            value={labelNameSubTheme}
            onChange={(event) => setLabelNameSubTheme(event.target.value as string[])}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Thèmes</em>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            <MenuItem disabled value="">
              <em>{subThemes.length ? 'Thèmes' : 'Pas de thématiques'}</em>
            </MenuItem>
            {subThemes.map((label: string, index: number) => (
              <MenuItem key={index} value={label} style={getStyles(label, labelNameSubTheme, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
}
