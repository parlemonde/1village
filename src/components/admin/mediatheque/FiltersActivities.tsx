import React, { useEffect, useState, useContext } from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { activitiesLabel, activityNumberMapper, subThemesMap, subThemeNumberMapper } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';

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

export default function FiltersActivities() {
  const theme = useTheme();
  const [labelNameActivity, setLabelNameActivity] = useState<string[]>([]);
  const [labelNameSubTheme, setLabelNameSubTheme] = useState<string[]>([]);
  const [, setActivityNumber] = useState<number[]>([]);
  const [, setSubThemeNumber] = useState<number[]>([]);
  const { setFilters } = useContext(MediathequeContext);

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

    if (updatedActivityNumbers.length > 0) {
      const result: { table: string; column: string; values: number[] }[][] = [[{ table: 'activity', column: 'type', values: [] }]];
      result[0][0].values = updatedActivityNumbers;
      setFilters(result);
      if (updatedSubThemeNumbers.length > 0) {
        const result = [
          [
            { table: 'activity', column: 'type', values: updatedActivityNumbers },
            { table: 'activity', column: 'subType', values: [] },
          ],
        ];
        updatedSubThemeNumbers.forEach((number) => {
          result[0][1].values.push(number);
        });
        setFilters(result);
      }
    }
  }, [labelNameActivity, labelNameSubTheme, setFilters]);

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
        <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
          <Select
            displayEmpty
            value={labelNameActivity.length > 0 ? labelNameActivity : ''}
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
