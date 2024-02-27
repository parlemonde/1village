import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Slider, Tooltip } from '@mui/material';

import type { AudioMixerTrack } from '../AudioMixer';
import { primaryColor } from 'src/styles/variables.const';

interface AudioMixerTrackControlProps {
  idx: number;
  mixTrack: AudioMixerTrack;
  soloTrackIdx: number | null;
  handleSolo: (trickIdx: number) => void;
  handleVolumeUpdate: (id: number, volume: number) => void;
}

const AudioMixerTrackControl = ({ mixTrack, idx, soloTrackIdx, handleSolo, handleVolumeUpdate }: AudioMixerTrackControlProps) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const color = idx === soloTrackIdx ? 'gold' : 'grey';
  const mutedColor = isMuted ? 'grey' : primaryColor;

  React.useEffect(() => {
    if (soloTrackIdx) {
      mixTrack.audioElement.muted = soloTrackIdx !== idx;
    } else {
      mixTrack.audioElement.muted = isMuted;
    }
  }, [idx, isMuted, mixTrack.audioElement, soloTrackIdx]);

  const toggleMute = () => {
    mixTrack.audioElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleSolo = (idx: number) => {
    handleSolo(idx);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    mixTrack.sampleVolume = newValue as number;
    mixTrack.audioElement.volume = newValue as number;
  };

  return (
    <div style={{ width: '100px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Slider
        aria-label="Mixing Volume"
        defaultValue={mixTrack.sampleVolume}
        onChange={handleChange}
        onChangeCommitted={() => handleVolumeUpdate(idx, mixTrack.audioElement.volume)}
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
        <Tooltip title={mixTrack.label} arrow>
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
