import React from 'react';

import { Button } from '@mui/material';

import AudioMixerTrackControl from './AudioMixerTrackControls/AudioMixerTrackControl';
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
  audioSource?: string;
};

const AudioMixer = React.forwardRef(({ tracks, verseTime, handleMixUpdate, audioSource }: AudioMixerProps, ref) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volumes, setVolumes] = React.useState(tracks.map((track) => track.sampleVolume));
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
    const newMix = volumes;
    newMix[idx] = volume;
    setVolumes(newMix);
    handleMixUpdate(volumes);
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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', height: 'auto' }}>
        <div style={{ border: '4px solid #666666', borderRadius: '20px', overflow: 'auto' }}>
          <div
            style={{
              padding: '10px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                isPlaying ? onPause() : onPlay();
              }}
            >
              {isPlaying ? 'Pause' : 'Jouer'}
            </Button>
            <span style={{ fontSize: '30px' }}>
              {toTime(counter)}/{toTime(verseTime)}
            </span>
            <Button variant="contained" onClick={onRestart}>
              Recommencer
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
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
          {/* <audio src={audioSource} style={{ width: '95%', height: '40px', marginBottom: '10px', marginLeft: '10px' }} /> */}
        </div>
      </div>
    </div>
  );
});

AudioMixer.displayName = 'AudioMixer';
export default AudioMixer;
