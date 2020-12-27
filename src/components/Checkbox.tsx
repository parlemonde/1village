import classnames from "classnames";
import React from "react";

import CheckboxIcon from "src/svg/check_box.svg";
import CheckboxOutlineIcon from "src/svg/check_box_outline.svg";

const SIZE = "1.4em";
const RIPPLE_SIZE = "2em";

interface CheckboxProps {
  label: string;
  isChecked?: boolean;
  color?: "default" | "primary" | "secondary" | "alert" | "success";
  style?: React.CSSProperties;
  onToggle?(): void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  style = {},
  color = "default",
  isChecked = false,
  onToggle = () => {},
}: CheckboxProps) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  // const prevIsFocused = React.useRef<>

  return (
    <label
      className={classnames("Checkbox", `Checkbox-${color}`, {
        "Checkbox--checked": isChecked,
      })}
      role="checkbox"
      style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer", ...style }}
      onMouseUp={() => {
        setTimeout(() => {
          setIsFocused(false);
        }, 0);
      }}
    >
      <span style={{ position: "relative", height: SIZE }}>
        <input
          type="checkbox"
          data-indeterminate="false"
          style={{ width: "0.5em", height: "0.5em", position: "absolute", top: 0, left: 0, opacity: 0 }}
          onChange={() => {
            onToggle();
          }}
          checked={isChecked}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        {isChecked ? (
          <CheckboxIcon style={{ position: "relative", zIndex: 1 }} aria-hidden="true" width={SIZE} height={SIZE} />
        ) : (
          <CheckboxOutlineIcon style={{ position: "relative", zIndex: 1 }} aria-hidden="true" width={SIZE} height={SIZE} />
        )}
        <span
          className={classnames("ripple", {
            "ripple--focused": isFocused,
          })}
          style={{ width: RIPPLE_SIZE, height: RIPPLE_SIZE, position: "absolute", top: "-0.3em", left: "-0.3em", zIndex: 0 }}
        ></span>
      </span>
      <span style={{ marginLeft: "0.25em" }}>{label}</span>
    </label>
  );
};
