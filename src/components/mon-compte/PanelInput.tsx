import type { CSSProperties } from 'react';
import React from 'react';

import TextField from '@mui/material/TextField';

interface PanelInputProps {
  value: string | undefined;
  defaultValue?: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  isEditMode?: boolean;
  isBold?: boolean;
  errorMsg?: string;
  helperText?: string;
  hasError?: boolean;
  type?: string;
  style?: CSSProperties;
  onChange?(newValue: string): void;
  onBlur?(): void | Promise<void>;
}

export const PanelInput = ({
  value,
  defaultValue = '',
  label,
  placeholder = '',
  isRequired = false,
  isEditMode = true,
  isBold = false,
  errorMsg,
  helperText,
  type = 'text',
  hasError = false,
  style = {},
  onChange = () => {},
  onBlur = () => {},
}: PanelInputProps) => {
  return (
    <div style={{ margin: '0.5rem', display: 'inline-flex', alignItems: 'flex-start', ...style }}>
      <label className={`text ${isBold ? 'text--bold' : ''}`} style={{ flexShrink: 0 }}>
        {label}
        {isRequired && <span style={{ color: 'red' }}>*</span>}
      </label>
      {isEditMode ? (
        <TextField
          value={value}
          variant="standard"
          autoComplete="false"
          className="account__input"
          color="primary"
          size="small"
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          type={type}
          onBlur={onBlur}
          error={hasError}
          helperText={hasError ? errorMsg : helperText}
        />
      ) : (
        <span style={{ marginLeft: '0.5rem' }}>{value || defaultValue}</span>
      )}
    </div>
  );
};
