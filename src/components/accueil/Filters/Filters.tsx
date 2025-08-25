import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';

import { FilterSelect } from './FilterSelect';
import { Flag } from 'src/components/Flag';
import { primaryColor } from 'src/styles/variables.const';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';

export const ACTIVITIES_PER_PHASE: { key: number; label: string; value: 'all' | number[] }[][] = [
  [
    { key: 0, label: 'Toutes', value: 'all' },
    { key: 1, label: 'Indices', value: [6] },
    // { key: 2, label: 'Symboles', value: [7] },
    // { key: 3, label: 'Questions', value: [3] },
    { key: 4, label: 'Mascottes', value: [8] },
  ],
  [
    { key: 0, label: 'Toutes', value: 'all' },
    { key: 1, label: 'Reportages', value: [9] },
    { key: 2, label: 'Défis', value: [2] },
    { key: 3, label: 'Jeux', value: [4] },
    { key: 4, label: 'Énigmes', value: [1] },
    { key: 5, label: 'Questions', value: [3] },
    { key: 6, label: 'Réactions', value: [10] },
  ],
  [
    { key: 0, label: 'Toutes', value: 'all' },
    { key: 1, label: 'Couplets', value: [12] },
    { key: 2, label: 'Histoires', value: [13] },
    { key: 3, label: 'Histoires ré-inventées', value: [14] },
  ],
  // ! Special for teacher in there dashboard (Better Comments to highlight)
  [
    { key: 0, label: 'Toutes', value: 'all' },
    { key: 1, label: 'Énigmes', value: [1] },
    { key: 2, label: 'Défis', value: [2] },
    { key: 3, label: 'Questions', value: [3] },
    { key: 4, label: 'Jeux', value: [4] },
    { key: 5, label: 'Indices', value: [6] },
    { key: 6, label: 'Symboles', value: [7] },
    { key: 7, label: 'Mascottes', value: [8] },
    { key: 8, label: 'Reportages', value: [9] },
    { key: 9, label: 'Réactions', value: [10] },
    { key: 10, label: 'Couplets', value: [12] },
    { key: 11, label: 'Histoires', value: [13] },
    { key: 12, label: 'Histoires ré-inventées', value: [14] },
  ],
];

export type FilterArgs = {
  selectedType: string | number;
  selectedPhase: string | number;
  types: number[] | 'all';
  status: number;
  countries: { [key: string]: boolean };
  pelico: boolean;
  searchTerm: string;
};

interface FiltersProps {
  countries?: string[];
  filters: FilterArgs;
  onChange: React.Dispatch<React.SetStateAction<FilterArgs>>;
  phase: number;
  isMesFamilles?: boolean;
}

export const Filters = ({ filters, onChange, countries = [], phase, isMesFamilles }: FiltersProps) => {
  React.useEffect(() => {
    onChange((f) => ({
      ...f,
      countries: countries.reduce<{ [key: string]: boolean }>((acc, c) => {
        acc[c] = true;
        return acc;
      }, {}),
    }));
  }, [onChange, countries]);

  return (
    <Box display="flex" alignItems="center" my={1} flexWrap="wrap">
      <Box component="span" className="text text--bold" mr={1}>
        Filtres :
      </Box>
      {isMesFamilles && (
        <FilterSelect
          name="Phases"
          options={[
            { key: 0, label: `Toutes`, value: 'all' },
            { key: 1, label: `Phase 1`, value: [6, 7, 3, 8] },
            { key: 2, label: `Phase 2`, value: [9, 2, 4, 1, 3, 10] },
            { key: 3, label: `Phase 3`, value: [12, 13, 14] },
          ]}
          value={filters.selectedPhase}
          onChange={(option) => {
            onChange({ ...filters, types: option.value, selectedPhase: option.key });
          }}
        />
      )}
      <FilterSelect
        name="Activités"
        options={ACTIVITIES_PER_PHASE[phase - 1] || []}
        value={filters.selectedType}
        onChange={(option) => {
          onChange({ ...filters, types: option.value, selectedType: option.key });
        }}
      />

      <Box display="flex" alignItems="center" flexWrap="wrap" mt={1}>
        {countries.map((c) => (
          <Box key={c} component="label" display="inline-flex" alignItems="center" mr={1} mb={1}>
            <Checkbox
              color="success"
              sx={{ padding: '0' }}
              checked={filters.countries[c] || false}
              onChange={(event) => {
                onChange({
                  ...filters,
                  countries: {
                    ...filters.countries,
                    [c]: event.target.checked,
                  },
                });
              }}
            />
            <Flag country={c} />
          </Box>
        ))}
        <Box component="label" display="inline-flex" alignItems="center" mr={1} mb={1}>
          <Checkbox
            color="success"
            sx={{ padding: '0' }}
            checked={filters.pelico}
            onChange={(event) => {
              onChange({
                ...filters,
                pelico: event.target.checked,
              });
            }}
          />
          <PelicoReflechit style={{ position: 'relative', zIndex: 10, height: '28px', width: 'auto', mt: '-10px', ml: '-5px' }} />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <input
          type="text"
          value={filters.searchTerm}
          placeholder=" Rechercher"
          style={{ border: `1px solid ${primaryColor}`, borderRadius: '5px', height: '26px' }}
          onChange={(event) => {
            onChange({
              ...filters,
              searchTerm: event.target.value,
            });
          }}
        />
      </Box>
    </Box>
  );
};
