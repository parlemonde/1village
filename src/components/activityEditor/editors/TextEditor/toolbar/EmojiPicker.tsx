import React from "react";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles, Theme, createStyles } from "@material-ui/core/styles";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

const emojis = [
  "😀",
  "😁",
  "😂",
  "😃",
  "😉",
  "😋",
  "😎",
  "😍",
  "😗",
  "🤗",
  "🤔",
  "😣",
  "😫",
  "😴",
  "😌",
  "🤓",
  "😛",
  "😜",
  "😠",
  "😇",
  "😷",
  "😈",
  "👻",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "🙈",
  "🙉",
  "🙊",
  "👼",
  "👮",
  "🕵",
  "💂",
  "👳",
  "🎅",
  "👸",
  "👰",
  "👲",
  "🙍",
  "🙇",
  "🚶",
  "🏃",
  "💃",
  "⛷",
  "🏂",
  "🏌",
  "🏄",
  "🚣",
  "🏊",
  "⛹",
  "🏋",
  "🚴",
  "👫",
  "💪",
  "👈",
  "👉",
  "👉",
  "👆",
  "🖕",
  "👇",
  "🖖",
  "🤘",
  "🖐",
  "👌",
  "👍",
  "👎",
  "✊",
  "👊",
  "👏",
  "🙌",
  "🙏",
  "🐵",
  "🐶",
  "🐇",
  "🐥",
  "🐸",
  "🐌",
  "🐛",
  "🐜",
  "🐝",
  "🍉",
  "🍄",
  "🍔",
  "🍤",
  "🍨",
  "🍪",
  "🎂",
  "🍰",
  "🍾",
  "🍷",
  "🍸",
  "🍺",
  "🌍",
  "🚑",
  "⏰",
  "🌙",
  "🌝",
  "🌞",
  "⭐",
  "🌟",
  "🌠",
  "🌨",
  "🌩",
  "⛄",
  "🔥",
  "🎄",
  "🎈",
  "🎉",
  "🎊",
  "🎁",
  "🎗",
  "🏀",
  "🏈",
  "🎲",
  "🔇",
  "🔈",
  "📣",
  "🔔",
  "🎵",
  "🎷",
  "💰",
  "🖊",
  "📅",
  "✅",
  "❎",
  "💯",
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: `1px solid ${theme.palette.divider}`,
    },
  }),
);

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

type EmojiPickerProps = {
  onChange(emoji: string): void;
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onChange }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const onSelect = (emoji: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange(emoji);
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
            <InsertEmoticonIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <div style={{ position: "relative" }}>
          {isOpen && (
            <div style={{ position: "absolute", left: "-3.5rem", bottom: "-7.75rem", zIndex: 1 }}>
              <Paper elevation={1} className={classes.paper}>
                <div style={{ maxHeight: "8rem", overflow: "scroll" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", width: "10rem", padding: "0.2rem" }}>
                    {emojis.map((c, index) => (
                      <div
                        style={{ margin: "0.2rem", height: "1.2rem", width: "1.2rem", display: "inline-block", cursor: "pointer" }}
                        key={index}
                        onMouseDown={onSelect(c)}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </Paper>
            </div>
          )}
        </div>
      </div>
    </ClickAwayListener>
  );
};
