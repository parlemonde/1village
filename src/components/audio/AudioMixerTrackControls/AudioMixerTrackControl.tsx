import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Slider, Tooltip } from '@mui/material';

import type { AudioMixerTrack } from '../AudioMixer';
import { primaryColor } from 'src/styles/variables.const';

interface AudioMixerTrackControlProps {
  track: AudioMixerTrack;
  idx: number;
  solo: (idx: number) => void;
  off: (idx: number, isMuted: boolean) => void;
  solos: boolean[];
}
const AudioMixerTrackControl = ({ track, idx, solo, off, solos }: AudioMixerTrackControlProps) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const color = solos[idx] ? 'gold' : 'grey';
  const mutedColor = isMuted ? 'grey' : primaryColor;
  // const musicIcons = [PianoIcon, GuitareIcon, TrumpetIcon, FluteIcon, DrumIcon, DrumkitIcon];

  const toggleMute = (idx: number) => {
    setIsMuted(isMuted ? false : true);
    off(idx, isMuted);
  };
  const toggleSolo = (idx: number) => {
    solo(idx);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    track.audioElement.volume = newValue as number;
    track.sampleVolume = newValue as number;
  };

  return (
    <div style={{ width: '100px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Slider
        aria-label="Mixing Volume"
        defaultValue={0.5}
        onChange={handleChange}
        step={0.1}
        marks
        min={0}
        max={1}
        orientation="vertical"
        sx={{
          height: '350px',
          color: 'gray',
          '& .MuiSlider-thumb': {
            backgroundImage: `url("/static-images/mix-button.png")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundColor: 'transparent',
            height: 35,
            borderRadius: '1px',
          },
        }}
      />
      <div
        style={{
          fontSize: 'smaller',
          borderColor: color,
          borderStyle: 'solid',
          borderWidth: 'thin',
          width: '40px',
          height: '20px',
          borderRadius: '3px',
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: '20px',
          cursor: 'pointer',
          margin: '10px 0px',
        }}
      >
        <span onClick={() => toggleSolo(idx)} style={{ color }}>
          SOLO
        </span>
      </div>
      <div
        style={{
          fontSize: 'smaller',
          borderColor: mutedColor,
          borderStyle: 'solid',
          borderWidth: 'thin',
          width: '40px',
          height: '20px',
          borderRadius: '25px',
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: '20px',
          cursor: 'pointer',
          margin: '5px 0px',
        }}
      >
        <span onClick={() => toggleMute(idx)} style={{ color: mutedColor }}>
          {isMuted ? 'OFF' : 'ON'}
        </span>
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Tooltip title={track.label} arrow>
          <InfoOutlinedIcon
            fontSize="small"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          />
        </Tooltip>
        {/* {React.createElement(musicIcons[idx], {
          key: `descimg--${idx}`,
          style: { width: '40px', height: '40px', margin: '5px 0px' },
        })} */}
      </div>
    </div>
  );
};

export default AudioMixerTrackControl;
