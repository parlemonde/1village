import React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
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
  value: "left" | "center" | "right";
  onChange(value: "left" | "center" | "right"): void;
};

export const TextAlignButtons: React.FC<InlineProps> = ({ value, onChange }: InlineProps) => {
  const handleAlignment = (newAlignment: "left" | "center" | "right" | undefined) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange(newAlignment);
  };

  return (
    <StyledToggleButtonGroup size="small" exclusive value={value} aria-label="text alignment">
      <ToggleButton value="left" aria-label="left aligned" onMouseDown={handleAlignment("left")}>
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered" onMouseDown={handleAlignment("center")}>
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned" onMouseDown={handleAlignment("right")}>
        <FormatAlignRightIcon />
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};
