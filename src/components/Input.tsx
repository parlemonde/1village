import classnames from "classnames";
import React from "react";

interface InputProps {
  name: string;
  color?: "primary" | "secondary";
  label: string;
  error?: boolean;
  helperText?: string | null;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  color = "primary",
  error = false,
  type = "text",
  helperText = null,
  style,
  placeholder,
  value,
  fullWidth = false,
  onChange = () => {},
}: InputProps) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const id = `input-${name}`;
  const helperId = `input-helper-${name}`;
  return (
    <div style={style}>
      <label htmlFor={id} style={{ display: "block", margin: "0 0 0.3em 0.1em" }}>
        {label}
      </label>
      <div
        className={classnames("Input", `Input--${error ? "error" : color}`, {
          "Input--focused": isFocused,
        })}
        style={{ position: "relative" }}
      >
        <input
          style={{ width: fullWidth ? "100%" : "unset" }}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          aria-describedby={helperId}
        />
      </div>
      <p id={helperId} style={{ marginTop: "0.1em" }} className={classnames(error ? "text-help" : "", "less")}>
        {helperText}
      </p>
    </div>
  );
};
