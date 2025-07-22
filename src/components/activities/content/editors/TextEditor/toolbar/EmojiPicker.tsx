import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import React from 'react';

const emojis = [
  '😀',
  '😁',
  '😂',
  '😃',
  '😉',
  '😋',
  '😎',
  '😍',
  '😗',
  '🤗',
  '🤔',
  '😣',
  '😫',
  '😴',
  '😌',
  '🤓',
  '😛',
  '😜',
  '😠',
  '😇',
  '😷',
  '😈',
  '👻',
  '😺',
  '😸',
  '😹',
  '😻',
  '😼',
  '😽',
  '🙀',
  '🙈',
  '🙉',
  '🙊',
  '👼',
  '👮',
  '🕵',
  '💂',
  '👳',
  '🎅',
  '👸',
  '👰',
  '👲',
  '🙍',
  '🙇',
  '🚶',
  '🏃',
  '💃',
  '⛷',
  '🏂',
  '🏌',
  '🏄',
  '🚣',
  '🏊',
  '⛹',
  '🏋',
  '🚴',
  '👫',
  '💪',
  '👈',
  '👉',
  '👉',
  '👆',
  '🖕',
  '👇',
  '🖖',
  '🤘',
  '🖐',
  '👌',
  '👍',
  '👎',
  '✊',
  '👊',
  '👏',
  '🙌',
  '🙏',
  '🐵',
  '🐶',
  '🐇',
  '🐥',
  '🐸',
  '🐌',
  '🐛',
  '🐜',
  '🐝',
  '🍉',
  '🍄',
  '🍔',
  '🍤',
  '🍨',
  '🍪',
  '🎂',
  '🍰',
  '🍾',
  '🍷',
  '🍸',
  '🍺',
  '🌍',
  '🚑',
  '⏰',
  '🌙',
  '🌝',
  '🌞',
  '⭐',
  '🌟',
  '🌠',
  '🌨',
  '🌩',
  '⛄',
  '🔥',
  '🎄',
  '🎈',
  '🎉',
  '🎊',
  '🎁',
  '🎗',
  '🏀',
  '🏈',
  '🎲',
  '🔇',
  '🔈',
  '📣',
  '🔔',
  '🎵',
  '🎷',
  '💰',
  '🖊',
  '📅',
  '✅',
  '❎',
  '💯',
];

type EmojiPickerProps = {
  onChange(emoji: string): void;
};

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
        <ToggleButtonGroup
          size="small"
          aria-label="text color"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              m: 0.5,
              border: 'none',
            },
          }}
        >
          <ToggleButton value="bold" aria-label="bold" onMouseDown={handleClick}>
            <InsertEmoticonIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <div style={{ position: 'relative' }}>
          {isOpen && (
            <div style={{ position: 'absolute', left: '-3.5rem', bottom: '-7.75rem', zIndex: 1 }}>
              <Paper elevation={1} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <div style={{ maxHeight: '8rem', overflow: 'scroll' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '10rem', padding: '0.2rem' }}>
                    {emojis.map((c, index) => (
                      <div
                        style={{ margin: '0.2rem', height: '1.2rem', width: '1.2rem', display: 'inline-block', cursor: 'pointer' }}
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
