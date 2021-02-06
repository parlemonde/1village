import React from 'react';

import TextField from '@material-ui/core/TextField';

interface PanelInputProps {
  value: string;
  defaultValue?: string;
  label: string;
  placeholder?: string;
  isEditMode?: boolean;
  errorMsg?: string;
  helperText?: string;
  hasError?: boolean;
  type?: string;
  onChange?(newValue: string): void;
  onBlur?(): void | Promise<void>;
}

export const PanelInput: React.FC<PanelInputProps> = ({
  value,
  defaultValue = '',
  label,
  placeholder = '',
  isEditMode = true,
  errorMsg,
  helperText,
  type = 'text',
  hasError = false,
  onChange = () => {},
  onBlur = () => {},
}: PanelInputProps) => {
  return (
    <div className="flex-center" style={{ margin: '0.5rem' }}>
      <label className="text text--bold" style={{ flexShrink: 0 }}>
        {label}
      </label>
      {isEditMode ? (
        <TextField
          value={value}
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
