import React from 'react';

import { Button } from '@mui/material';

import AudioMixerTrackControl from './AudioMixerTrackControls/AudioMixerTrackControl';
import type { Track } from 'src/activity-types/anthem.types';
import { getLongestVerseSampleDuration } from 'src/utils/audios';
import { toTime } from 'src/utils/toTime';

export interface AudioMixerTrack {
  sampleVolume: number;
  label: string;
  iconUrl: string;
  audioElement: HTMLAudioElement;
}

type AudioMixerProps = {
  tracks: Track[];
  audioSource?: string;
};

const AudioMixer = ({ tracks, audioSource }: AudioMixerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volumes, setVolumes] = React.useState([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
  const [solos, setSolos] = React.useState([false, false, false, false, false, false]);
  const [counter, setCounter] = React.useState(0);
  const counterIntervalId = React.useRef<number | undefined>(undefined);

  const verseTime = React.useMemo(() => getLongestVerseSampleDuration(tracks), [tracks]);

  const audioMixerTracks: AudioMixerTrack[] = React.useMemo(() => {
    return tracks.map((track) => ({
      sampleVolume: track.sampleVolume || 0.5,
      label: track.label,
      iconUrl: track.iconUrl,
      audioElement: new Audio(track.sampleUrl),
    }));
  }, [tracks]);

  const onPlay = React.useCallback(() => {
    if (audioMixerTracks.length === 0) {
      return;
    }
    setIsPlaying(true);
    window.clearInterval(counterIntervalId.current);
    counterIntervalId.current = window.setInterval(() => setCounter((counter: number) => counter + 1), 1000);
    audioMixerTracks.forEach((track) => {
      track.audioElement.play();
    });
  }, [audioMixerTracks]);

  const onPause = React.useCallback(() => {
    setIsPlaying(false);
    window.clearInterval(counterIntervalId.current);
    audioMixerTracks.forEach((track) => {
      track.audioElement.pause();
    });
  }, [audioMixerTracks]);

  const onRestart = React.useCallback(() => {
    setCounter(0);
    audioMixerTracks.forEach((track) => {
      track.audioElement.currentTime = 0;
    });
  }, [audioMixerTracks]);

  const onStop = React.useCallback(() => {
    onPause();
    onRestart();
  }, [onPause, onRestart]);

  const solo = (idx: number) => {
    const newVolumes = volumes.map((volume, index) => {
      const track = audioMixerTracks[index];
      if (!track) {
        return 0;
      }
      const newVolume = track.audioElement.volume !== 0 ? track.audioElement.volume : volume;
      track.audioElement.volume = idx !== index ? (solos[idx] ? newVolume : 0) : track.audioElement.volume === 0 ? 1 : track.audioElement.volume;
      return newVolume;
    });
    setVolumes(newVolumes);
    setSolos((solos: boolean[]) => solos.map((el, index) => (index === idx ? !el : false)));
  };

  const toggleVolume = (idx: number, isMuted: boolean) => {
    audioMixerTracks.forEach((track, index) => {
      track.audioElement.volume = idx === index ? (isMuted ? 1 : 0) : track.audioElement.volume;
    });
  };

  React.useEffect(() => {
    if (counter >= Math.floor(verseTime)) {
      window.clearInterval(counterIntervalId.current);
      onStop();
    }
  }, [counter, verseTime, onStop]);

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
            {audioMixerTracks.map((track, idx) => (
              <AudioMixerTrackControl key={`mix--${idx}`} track={track} idx={idx} solo={solo} off={toggleVolume} solos={solos} />
            ))}
          </div>
          <audio src={audioSource} style={{ width: '95%', height: '40px', marginBottom: '10px', marginLeft: '10px' }} />
        </div>
      </div>
    </div>
  );
};

export default AudioMixer;
