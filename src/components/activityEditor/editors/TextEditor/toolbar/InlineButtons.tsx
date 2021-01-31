import React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

type InlineProps = {
  value: {
    BOLD: boolean;
    ITALIC: boolean;
    UNDERLINE: boolean;
  };
  onChange(type: "BOLD" | "ITALIC" | "UNDERLINE", value: boolean): void;
};

export const InlineButtons: React.FC<InlineProps> = ({ value, onChange }: InlineProps) => {
  const formats = React.useMemo(
    () =>
      Object.keys(value)
        .filter((key) => ["BOLD", "ITALIC", "UNDERLINE"].includes(key))
        .filter((key) => value[key as "BOLD" | "ITALIC" | "UNDERLINE"]),
    [value],
  );

  return (
    <StyledToggleButtonGroup size="small" value={formats} aria-label="text formatting">
      <ToggleButton
        value="BOLD"
        aria-label="bold"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange("BOLD", !value.BOLD);
        }}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        value="ITALIC"
        aria-label="italic"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange("ITALIC", !value.ITALIC);
        }}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        value="UNDERLINE"
        aria-label="underline"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange("UNDERLINE", !value.UNDERLINE);
        }}
      >
        <FormatUnderlinedIcon />
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};
