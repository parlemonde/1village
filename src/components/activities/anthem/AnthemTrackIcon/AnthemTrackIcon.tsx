import React, { useState } from 'react';

import { TextField, IconButton, Autocomplete, Popper, Fade, Paper, Box, Icon } from '@mui/material';

import type { DisplayableInstrumentsType } from '../../../../utils/instruments';
import { InstrumentSvg } from '../InstrumentSvg/InstrumentSvg';
import styles from './AnthemTrackIcon.module.css';
import type { Track } from 'types/anthem.type';

export interface AnthemTrackProps {
  track: Track;
  handleIconUpdate: (track: Track, iconUrl: string) => void;
  instruments: DisplayableInstrumentsType[];
}

const AnthemTrackIcon = ({ track, handleIconUpdate, instruments }: AnthemTrackProps) => {
  const [open, setOpen] = useState(false);
  const anchorel = React.useRef(null);

  return (
    <div className={styles.trackPicture}>
      <IconButton aria-label="fingerprint" color="primary" ref={anchorel} onClick={() => setOpen(!open)}>
        <InstrumentSvg instrumentName={track.iconUrl} />
      </IconButton>
      {/* TODO change scrollbar aspect */}
      <Popper open={open} anchorEl={anchorel.current} placement={'bottom-start'} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Box className={styles.autocompleteList}>
                <Autocomplete
                  id="instruments-list"
                  className={styles.autocompleteBox}
                  sx={{ width: 300 }}
                  options={instruments}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  autoHighlight
                  getOptionLabel={(option) => option.name}
                  open={open}
                  onClose={() => setOpen(false)}
                  PopperComponent={({ children, ...popperProps }) => (
                    <div {...popperProps} style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 1 }}>
                      {children}
                    </div>
                  )}
                  PaperComponent={({ children, ...paperProps }) => (
                    <div {...paperProps} className={styles.paperComp}>
                      {children}
                    </div>
                  )}
                  renderOption={(props, option) => (
                    <Box
                      className={styles.instrumentList}
                      component="li"
                      sx={{ '& > span': { mr: 2, flexShrink: 0 } }}
                      {...props}
                      onClick={() => {
                        setOpen(false);
                        handleIconUpdate(track, option.value);
                      }}
                    >
                      <div className={styles.iconList}>
                        <Icon>
                          <InstrumentSvg instrumentName={option.value} />
                        </Icon>
                      </div>
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Instruments"
                      placeholder=""
                      autoFocus
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          border: '1px solid #ccc',
                          padding: '8px',
                          borderRadius: '4px',
                        },
                        startAdornment: <>{params.InputProps.startAdornment}</>,
                      }}
                    />
                  )}
                />
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

AnthemTrackIcon.displayName = 'AnthemTrackIcon';
export default AnthemTrackIcon;
