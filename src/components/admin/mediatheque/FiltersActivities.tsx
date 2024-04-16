import React, { useEffect, useState } from 'react';

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

const subThemesMap: { [key: string]: string[] } = {
  'Indice culturel': themeOfIndiceCulturel,
  'Indice symbolique': themeOfIndiceSymbolique,
  Défis: themeOfDefi,
  Jeux: themeOfJeux,
  Enigme: themeOfEnigme,
};

const activityNumberMapper = {
  'Indice culturel': 0,
  'Indice symbolique': 1,
  Mascotte: 2,
  Reportage: 3,
  Défis: 4,
  Jeux: 5,
  Symbole: 6,
  Réaction: 7,
  Enigme: 8,
  Hymne: 9,
  Couplet: 11,
  'Inventer une histoire': 13,
  'Réinventer une histoire': 14,
};

const subThemeNumberMapper = {
  Paysages: 0,
  Arts: 1,
  'Lieux de vies': 2,
  Langues: 3,
  'Flore et faune': 4,
  'Loisirs et jeux': 5,
  Cuisines: 6,
  Traditions: 7,
  Autre: -1,
  Drapeau: 0,
  Emblème: 1,
  'Fleur nationale': 2,
  Devise: 3,
  Hymne: 4,
  'Animal national': 5,
  'Figure symbolique': 6,
  Monnaie: 7,
  Culinaire: 0,
  Linguistique: 1,
  Ecologique: 2,
  'Jeu des mimiques': 0,
  'Jeu de la monnaie': 1,
  'Jeu des expressions': 2,
  'Evenement mystère': 0,
  'Lieu mystère': 1,
  'Objet mystère': 2,
  'Personnalité mystère': 3,
};

export default function FiltersActivities() {
  const theme = useTheme();
  const [labelNameActivity, setLabelNameActivity] = useState<string[]>([]);
  const [labelNameSubTheme, setLabelNameSubTheme] = useState<string[]>([]);
  const [activityNumber, setActivityNumber] = useState<number[]>([]);
  const [subThemeNumber, setSubThemeNumber] = useState<number[]>([]);
  console.log('label Activity', labelNameActivity);
  console.log('label subTheme', labelNameSubTheme);
  console.log('activityNumber', activityNumber);
  console.log('subThmeNumber', subThemeNumber);

  useEffect(() => {
    const updatedActivityNumbers: number[] = [];
    const updatedSubThemeNumbers: number[] = [];

    labelNameActivity.forEach((activity) => {
      const number = activityNumberMapper[activity];
      if (number !== undefined && !updatedActivityNumbers.includes(number)) {
        updatedActivityNumbers.push(number);
      }
    });

    labelNameSubTheme.forEach((subTheme) => {
      const number = subThemeNumberMapper[subTheme];
      if (number !== undefined && !updatedSubThemeNumbers.includes(number)) {
        updatedSubThemeNumbers.push(number);
      }
    });

    setActivityNumber(updatedActivityNumbers);
    setSubThemeNumber(updatedSubThemeNumbers);
  }, [labelNameActivity, labelNameSubTheme]);

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
