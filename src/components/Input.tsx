import classnames from "classnames";
import React from "react";

interface InputProps {
  name: string;
  label: string;
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
  type = "text",
  style,
  placeholder,
  value,
  fullWidth = false,
  onChange = () => {},
}: InputProps) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const id = `input-${name}`;
  return (
    <div style={style}>
      <label htmlFor={id} style={{ display: "block", margin: "0 0 0.3em 0.1em" }}>
        {label}
      </label>
      <div
        className={classnames("Input", {
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
        />
      </div>
    </div>
  );
};
