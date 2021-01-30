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
  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: "left" | "center" | "right" | undefined) => {
    onChange(newAlignment);
  };

  return (
    <StyledToggleButtonGroup size="small" exclusive value={value} onChange={handleAlignment} aria-label="text alignment">
      <ToggleButton value="left" aria-label="left aligned">
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <FormatAlignRightIcon />
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};
