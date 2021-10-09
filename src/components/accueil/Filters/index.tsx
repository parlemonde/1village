import React from 'react';

import type { CheckboxProps } from '@material-ui/core/Checkbox';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

import { Flag } from 'src/components/Flag';
import { successColor } from 'src/styles/variables.const';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';

import { FilterSelect } from './FilterSelect';

const GreenCheckbox = withStyles({
  checked: {
    color: successColor,
  },
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export type FilterArgs = {
  type: number;
  status: number;
  countries: { [key: string]: boolean };
  pelico: boolean;
};

interface FiltersProps {
  countries?: string[];
  filters: FilterArgs;
  onChange: React.Dispatch<React.SetStateAction<FilterArgs>>;
}

export const Filters = ({ filters, onChange, countries = [] }: FiltersProps) => {
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
        options={[
          { key: 0, label: 'Toutes' },
          { key: 1, label: 'Présentations' },
          { key: 2, label: 'Énigmes' },
          { key: 3, label: 'Défis' },
          { key: 4, label: 'Questions' },
          { key: 5, label: 'Jeux' },
        ]}
        value={filters.type}
        onChange={(newType) => {
          onChange({ ...filters, type: newType });
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
          onChange({ ...filters, status: newStatus });
        }}
      /> */}
      <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
        {countries.map((c) => (
          <label key={c} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: '0 0.5rem 0 0.2rem' }}>
            <GreenCheckbox
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
          <GreenCheckbox
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
