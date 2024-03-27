import React from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import { primaryColor } from 'src/styles/variables.const';

export type Option<T> = {
  key: number | string;
  label: string;
  value: T | 'all';
};

interface FilterSelectProps<T> {
  options: Option<T>[];
  name: string;
  value: number | string;
  onChange(option: Option<T>): void;
}

export const FilterSelect = <T,>({ value, onChange, name, options }: FilterSelectProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((o) => o.key === value) || null;

  return (
    <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
      <div
        style={{ display: 'inline-block', cursor: 'pointer', border: `1px solid ${primaryColor}`, borderRadius: '5px' }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <div
          style={{
            padding: '0 0.4rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span className="text text--small" style={{ marginRight: '0.2rem' }}>
            {name}
          </span>
          <span
            className="text text--small bg-primary-light"
            style={{ padding: '0.2rem 0.5rem', borderRadius: '0.8rem', textDecoration: 'underline' }}
          >
            {selectedOption?.label || ''}
          </span>
          <ExpandMoreIcon />
        </div>
      </div>

      {isOpen && (
        <ClickAwayListener
          onClickAway={() => {
            setIsOpen(false);
          }}
        >
          <div
            style={{
              display: 'inline-block',
              border: `1px solid ${primaryColor}`,
              borderRadius: '5px',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'white',
              zIndex: 20,
            }}
          >
            <div
              style={{
                padding: '0 0.4rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <span className="text text--small" style={{ marginRight: '0.2rem' }}>
                {name}
              </span>
              <span
                className="text text--small bg-primary-light"
                style={{ padding: '0.2rem 0.5rem', borderRadius: '0.8rem', textDecoration: 'underline' }}
              >
                {selectedOption?.label || ''}
              </span>
              <ExpandLessIcon />
            </div>

            <div style={{ padding: '0 0.4rem', overflowY: 'auto', height: '125px' }}>
              <FormGroup>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.key}
                    style={{ margin: 0, cursor: 'pointer' }}
                    control={
                      <Checkbox
                        size="small"
                        style={{ padding: '0', marginRight: '0.5rem' }}
                        checked={selectedOption !== null && selectedOption.key === option.key}
                        onChange={() => {
                          onChange(option);
                          setIsOpen(false);
                        }}
                        name={`${option.key}`}
                        color="primary"
                      />
                    }
                    label={
                      <span className="text text--small" style={{ cursor: 'pointer' }}>
                        {option.label}
                      </span>
                    }
                  />
                ))}
              </FormGroup>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
