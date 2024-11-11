import { Button } from '@mui/material';
import React from 'react';

import AudioMixerTrackControl from '../AudioMixerTrackControls/AudioMixerTrackControl';
import styles from './AudioMixer.module.css';
import { toTime } from 'src/utils/toTime';

export interface AudioMixerTrack {
  sampleVolume: number;
  label: string;
  iconUrl: string;
  audioElement: HTMLAudioElement;
}

type AudioMixerProps = {
  tracks: AudioMixerTrack[];
  verseTime: number;
  handleMixUpdate: (volumes: number[]) => void;
};

const AudioMixer = React.forwardRef(({ tracks, verseTime, handleMixUpdate }: AudioMixerProps, ref) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [soloTrackIdx, setSoloTrackIdx] = React.useState<number | null>(null);
  const [counter, setCounter] = React.useState(0);
  const counterIntervalId = React.useRef<number | undefined>(undefined);

  const onPlay = React.useCallback(() => {
    if (tracks.length === 0) {
      return;
    }
    setIsPlaying(true);
    window.clearInterval(counterIntervalId.current);
    counterIntervalId.current = window.setInterval(() => setCounter((counter: number) => counter + 1), 1000);
    tracks.forEach((track) => {
      track.audioElement.play();
    });
  }, [tracks]);

  const onPause = React.useCallback(() => {
    setIsPlaying(false);
    window.clearInterval(counterIntervalId.current);
    tracks.forEach((track) => {
      track.audioElement.pause();
    });
  }, [tracks]);

  const onRestart = React.useCallback(() => {
    setCounter(0);
    tracks.forEach((track) => {
      track.audioElement.currentTime = 0;
    });
  }, [tracks]);

  const onStop = React.useCallback(() => {
    onPause();
    onRestart();
  }, [onPause, onRestart]);

  const handleVolumeUpdate = (idx: number, volume: number) => {
    handleMixUpdate(tracks.map((track, i) => (i === idx ? volume : track.sampleVolume)));
  };

  const handleSolo = (trackIdx: number) => {
    setSoloTrackIdx(soloTrackIdx === trackIdx ? null : trackIdx);
  };

  React.useEffect(() => {
    if (counter >= Math.floor(verseTime)) {
      window.clearInterval(counterIntervalId.current);
      onStop();
    }
  }, [counter, verseTime, onStop]);

  React.useImperativeHandle(ref, () => ({
    stopMixer() {
      onStop();
    },
  }));

  return (
    <div className={styles.mixerWrapper}>
      <div className={styles.mixerContainer}>
        <div className={styles.mixerFrame}>
          <div className={styles.mixerHeader}>
            <Button
              variant="contained"
              onClick={() => {
                isPlaying ? onPause() : onPlay();
              }}
            >
              {isPlaying ? 'Pause' : 'Jouer'}
            </Button>
            <span className={styles.mixerCounter}>
              {toTime(counter)}/{toTime(verseTime)}
            </span>
            <Button variant="contained" onClick={onRestart}>
              Recommencer
            </Button>
          </div>
          <div className={styles.mixerTrackControlsContainer}>
            {tracks.map((mixTrack, idx) => (
              <AudioMixerTrackControl
                key={`mix--${idx}`}
                idx={idx}
                mixTrack={mixTrack}
                soloTrackIdx={soloTrackIdx}
                handleSolo={handleSolo}
                handleVolumeUpdate={handleVolumeUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

AudioMixer.displayName = 'AudioMixer';
export default AudioMixer;
