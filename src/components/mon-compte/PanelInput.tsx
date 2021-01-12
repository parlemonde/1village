import React from "react";

import TextField from "@material-ui/core/TextField";

interface PanelInputProps {
  value: string;
  defaultValue?: string;
  label: string;
  placeholder?: string;
  onChange?(newValue: string): void;
  isEditMode?: boolean;
}

export const PanelInput: React.FC<PanelInputProps> = ({
  value,
  defaultValue = "",
  label,
  placeholder = "",
  onChange = () => {},
  isEditMode = false,
}: PanelInputProps) => {
  return (
    <div className="flex-center" style={{ margin: "0.5rem" }}>
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
        />
      ) : (
        <span style={{ marginLeft: "0.5rem" }}>{value || defaultValue}</span>
      )}
    </div>
  );
};
