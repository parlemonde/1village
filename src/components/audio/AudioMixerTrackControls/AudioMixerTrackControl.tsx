import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Slider, Tooltip } from '@mui/material';
import React from 'react';

import type { AudioMixerTrack } from '../AudioMixer/AudioMixer';
import styles from './AudioMixerTrackControl.module.css';
import { InstrumentSvg } from 'src/components/activities/anthem/InstrumentSvg/InstrumentSvg';
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
  const soloColor = idx === soloTrackIdx ? 'gold' : 'grey';
  const mutedColor = isMuted ? 'grey' : primaryColor;

  React.useEffect(() => {
    if (soloTrackIdx !== null) {
      mixTrack.audioElement.muted = soloTrackIdx !== idx;
    } else {
      mixTrack.audioElement.muted = isMuted;
    }
  }, [idx, isMuted, mixTrack.audioElement, soloTrackIdx]);

  const lastVolumeRef = React.useRef<number>(1);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      lastVolumeRef.current = mixTrack.sampleVolume || 1;
      mixTrack.audioElement.volume = 0;
      handleVolumeUpdate(idx, 0);
    } else {
      mixTrack.audioElement.volume = lastVolumeRef.current / 2;
      handleVolumeUpdate(idx, lastVolumeRef.current);
    }
  };

  const toggleSolo = (idx: number) => {
    handleSolo(idx);
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider
        aria-label="Mixing Volume"
        value={mixTrack.sampleVolume ?? 1}
        onChange={(_event: Event, value: number | number[]) => {
          handleVolumeUpdate(idx, Array.isArray(value) ? value[0] : value);
          mixTrack.audioElement.volume = (Array.isArray(value) ? value[0] : value) / 2;
        }}
        step={0.2}
        marks
        min={0}
        max={2}
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
      <div className={styles.soloButton} style={{ borderColor: soloColor }} onClick={() => toggleSolo(idx)}>
        <span style={{ color: soloColor }}>SOLO</span>
      </div>
      <div className={styles.muteButton} style={{ borderColor: mutedColor }} onClick={() => toggleMute()}>
        <span style={{ color: mutedColor }}>{isMuted ? 'OFF' : 'ON'}</span>
      </div>
      <div className={styles.iconContainer}>
        <Tooltip title={mixTrack.label} arrow>
          <InfoOutlinedIcon
            fontSize="small"
            sx={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          />
        </Tooltip>
        <div className={styles.iconFrame}>
          <InstrumentSvg instrumentName={mixTrack.iconUrl} />
        </div>
      </div>
    </div>
  );
};

export default AudioMixerTrackControl;
