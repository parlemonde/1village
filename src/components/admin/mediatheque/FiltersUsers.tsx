import React, { useEffect, useState, useContext, useCallback } from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

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

export default function FiltersUsers() {
  const { setFilters, setUpdatePageKey, setPage, villageMondes, filters } = useContext(MediathequeContext);

  const theme = useTheme();

  const [labelNameVillageMonde, setLabelNameVillageMonde] = useState<string[]>();
  const [labelNameVillageMondeSelect, setLabelNameVillageMondeSelect] = useState<string[]>();

  useEffect(() => {
    setLabelNameVillageMondeSelect(villageMondes.map((vm) => vm.name));
  }, [villageMondes]);

  const handleChangeLabelActivity = (event: SelectChangeEvent<typeof labelNameVillageMonde>) => {
    const {
      target: { value },
    } = event;
    setLabelNameVillageMonde(typeof value === 'string' ? value.split(',') : value);
  };

  const updateFilters = useCallback(() => {
    const updatedVillageMondeId = labelNameVillageMonde?.map((vm) => villageMondes.find((village) => village.name === vm)?.id);
    const newFilters = filters.length ? filters : [];
    if (updatedVillageMondeId?.length > 0) {
      const villageMondeFilter = { table: 'activity', column: 'villageId', values: updatedVillageMondeId };
      newFilters[0].push(villageMondeFilter);
    }
    setUpdatePageKey((prevKey) => prevKey + 1);
    setPage(0);
    setFilters(newFilters);
  }, [filters, labelNameVillageMonde, setFilters, setPage, setUpdatePageKey, villageMondes]);

  useEffect(() => {
    updateFilters();
  }, [labelNameVillageMonde, updateFilters]);

  return (
    <>
      <div>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            multiple
            displayEmpty
            value={labelNameVillageMonde?.length ? labelNameVillageMonde : []}
            onChange={handleChangeLabelActivity}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>VM</>;
              }
              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Label' }}
          >
            {labelNameVillageMondeSelect?.map((name, id) => (
              <MenuItem key={id} value={name} style={getStyles(name, labelNameVillageMondeSelect, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* <div>
        <FormControl sx={{ m: 1, width: 140 }} size="small">
          <Select
            multiple
            displayEmpty
            value={labelNameCountry}
            onChange={(event) => setLabelNameCountry(event.target.value as string[])}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Pays</>;
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
              <MenuItem key={index} value={label} style={getStyles(label, labelNameCountry, theme)}>
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
            value={labelNameClass}
            onChange={(event) => setLabelNameClass(event.target.value as string[])}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>Classes</>;
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
              <MenuItem key={index} value={label} style={getStyles(label, labelNameClass, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div> */}
    </>
  );
}
