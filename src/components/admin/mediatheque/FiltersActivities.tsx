import React, { useEffect, useState, useContext, useCallback } from 'react';

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
  const { setFilters } = useContext(MediathequeContext);

  const updateFilters = useCallback(() => {
    const updatedActivityNumbers = labelNameActivity.map((activity) => activityNumberMapper[activity]).filter(Boolean);
    const updatedSubThemeNumbers = labelNameSubTheme.map((subTheme) => subThemeNumberMapper[subTheme]).filter(Boolean);

    const newFilters = [];
    if (updatedActivityNumbers.length > 0) {
      const activityFilter = { table: 'activity', column: 'type', values: updatedActivityNumbers };
      newFilters.push([activityFilter]);

      if (updatedSubThemeNumbers.length > 0) {
        const subThemeFilter = { table: 'activity', column: 'subType', values: updatedSubThemeNumbers };
        newFilters[0].push(subThemeFilter);
      }
    }
    setFilters(newFilters);
  }, [labelNameActivity, labelNameSubTheme, setFilters]);

  useEffect(() => {
    updateFilters();
  }, [labelNameActivity, labelNameSubTheme, updateFilters]);

  const handleChangeLabelActivity = (event: SelectChangeEvent<typeof labelNameActivity>) => {
    const {
      target: { value },
    } = event;
    setLabelNameActivity(typeof value === 'string' ? value.split(',') : value);
    setLabelNameSubTheme([]);
  };

  const subThemes = labelNameActivity.flatMap((activity) => subThemesMap[activity] || []);

  return (
    <>
      <div>
        <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
          <Select
            displayEmpty
            value={labelNameActivity.length > 0 ? labelNameActivity : ''}
            onChange={handleChangeLabelActivity}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Activités</>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {activitiesLabel.map((label, index) => (
              <MenuItem key={index} value={label} style={getStyles(label, labelNameActivity, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
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
                return <>Thèmes</>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            <MenuItem disabled value="">
              <em>{subThemes.length ? 'Thèmes' : 'Pas de thématiques'}</em>
            </MenuItem>
            {subThemes.map((label, index) => (
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
