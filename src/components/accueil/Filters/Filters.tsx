import React from 'react';

import Checkbox from '@mui/material/Checkbox';

import { Flag } from 'src/components/Flag';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';

import { FilterSelect } from './FilterSelect';

export const ACTIVITIES_PER_PHASE: { key: number; label: string; value: 'all' | number[] }[][] = [
  [
    { key: 0, label: 'Toutes', value: 'all' },
    { key: 1, label: 'Indices culturels', value: [6] },
    { key: 2, label: 'Symboles', value: [7] },
    { key: 3, label: 'Questions', value: [3] },
    { key: 4, label: 'Mascotte', value: [8] },
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
    { key: 1, label: 'Couplet', value: [12] },
  ],
];

export type FilterArgs = {
  selectedType: string | number;
  types: number[] | 'all';
  status: number;
  countries: { [key: string]: boolean };
  pelico: boolean;
};

interface FiltersProps {
  countries?: string[];
  filters: FilterArgs;
  onChange: React.Dispatch<React.SetStateAction<FilterArgs>>;
  phase: number;
}

export const Filters = ({ filters, onChange, countries = [], phase }: FiltersProps) => {
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
    <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0', flexWrap: 'wrap' }}>
      <span className="text text--bold">Filtres :</span>
      <FilterSelect
        name="Activités"
        options={ACTIVITIES_PER_PHASE[phase - 1] || []}
        value={filters.selectedType}
        onChange={(option) => {
          onChange({ ...filters, types: option.value, selectedType: option.key });
        }}
      />
      {/* <FilterSelect
        name="Status"
        options={[
          { key: 0, label: 'Tous' },
          { key: 1, label: 'En cours' },
          { key: 2, label: 'Terminées' },
        ]}
        value={filters.status}
        onChange={(newStatus) => {
          onChange({ ...filters, status: newStatus.key });
        }}
      /> */}
      <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
        {countries.map((c) => (
          <label key={c} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: '0 0.5rem 0 0.2rem' }}>
            <Checkbox
              color="success"
              style={{ padding: '0' }}
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
          </label>
        ))}
        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: '0 0.5rem 0 0.2rem' }}>
          <Checkbox
            color="success"
            style={{ padding: '0' }}
            checked={filters.pelico}
            onChange={(event) => {
              onChange({
                ...filters,
                pelico: event.target.checked,
              });
            }}
          />
          <PelicoReflechit style={{ position: 'relative', zIndex: 10, height: '28px', width: 'auto', marginTop: '-10px', marginLeft: '-5px' }} />
        </label>
      </div>
    </div>
  );
};
