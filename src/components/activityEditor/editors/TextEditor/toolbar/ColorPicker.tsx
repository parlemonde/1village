import React from "react";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, withStyles, Theme } from "@material-ui/core/styles";
import FormatColorTextIcon from "@material-ui/icons/FormatColorText";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: `1px solid ${theme.palette.divider}`,
    },
  }),
);

const colors = [
  "rgb(46, 52, 59)",
  "rgb(97,189,109)",
  "rgb(26,188,156)",
  "rgb(84,172,210)",
  "rgb(44,130,201)",
  "rgb(147,101,184)",
  "rgb(71,85,119)",
  "rgb(65,168,95)",
  "rgb(0,168,133)",
  "rgb(61,142,185)",
  "rgb(41,105,176)",
  "rgb(85,57,130)",
  "rgb(0,0,0)",
  "rgb(247,218,100)",
  "rgb(251,160,38)",
  "rgb(235,107,86)",
  "rgb(226,80,65)",
  "rgb(163,143,132)",
  "rgb(209,213,216)",
  "rgb(250,197,28)",
  "rgb(243,121,52)",
  "rgb(209,72,65)",
  "rgb(184,49,47)",
  "rgb(124,112,107)",
];

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

type ColorPickerProps = {
  value: string;
  onChange(value: string): void;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const onSelect = (color: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange(color);
    setIsOpen(false);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <StyledToggleButtonGroup size="small" aria-label="text color">
          <ToggleButton value="bold" aria-label="bold" onMouseDown={handleClick}>
            <FormatColorTextIcon style={{ color: value || "rgb(46, 52, 59)" }} />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <div style={{ position: "relative" }}>
          {isOpen && (
            <div style={{ position: "absolute", left: "-3.5rem", bottom: "-6.5rem", zIndex: 1 }}>
              <Paper elevation={1} className={classes.paper}>
                <div style={{ display: "flex", flexWrap: "wrap", width: "10rem", padding: "0.2rem" }}>
                  {colors.map((c, index) => (
                    <div
                      style={{ margin: "0.2rem", backgroundColor: c, height: "1.2rem", width: "1.2rem", display: "inline-block", cursor: "pointer" }}
                      key={index}
                      onClick={onSelect(c)}
                    ></div>
                  ))}
                </div>
              </Paper>
            </div>
          )}
        </div>
      </div>
    </ClickAwayListener>
  );
};
