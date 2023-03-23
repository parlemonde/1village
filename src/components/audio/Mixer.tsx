import React from 'react';

import { Button } from '@mui/material';
import Slider from '@mui/material/Slider';

import type { Sample } from 'src/activity-types/anthem.types';
import { primaryColor } from 'src/styles/variables.const';
import DrumIcon from 'src/svg/anthem/drum.svg';
import DrumkitIcon from 'src/svg/anthem/drumkit.svg';
import FluteIcon from 'src/svg/anthem/flute.svg';
import GuitareIcon from 'src/svg/anthem/guitare.svg';
import PianoIcon from 'src/svg/anthem/piano.svg';
import TrumpetIcon from 'src/svg/anthem/trumpet.svg';
import { toTime } from 'src/utils/toTime';

interface Audio {
  value: string;
  volume: number;
}

type AudioMixerProps = {
  verseTime: number;
  verseAudios: Sample[];
  audioSource?: string;
  onUpdateAudioMix: (newAudioMixBlob: Blob) => void;
};

const AudioMixer = ({ verseTime, verseAudios, audioSource, onUpdateAudioMix }: AudioMixerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [volumes, setVolumes] = React.useState([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
  const [solos, setSolos] = React.useState([false, false, false, false, false, false]);
  const [counter, setCounter] = React.useState(0);
  const counterIntervalId = React.useRef<number | undefined>(undefined);
  const timeoutId = React.useRef<number | undefined>(undefined);
  const audioContext = React.useRef<AudioContext | null>(null);
  const recorder = React.useRef<MediaRecorder | null>(null);
  const audioLabels = React.useMemo(() => verseAudios.map((audio) => audio.label), [verseAudios]);
  const audiosTracks = React.useMemo(() => verseAudios.slice(1).map((audio) => ({ value: audio.value, volume: 0.5 })), [verseAudios]);
  const audiosEl = React.useMemo(() => {
    const elements = audiosTracks.map((audio: Audio) => new Audio(audio.value));
    elements.forEach((audio) => {
      audio.volume = 0.5;
    });
    return elements;
  }, [audiosTracks]);

  const onPlay = React.useCallback(() => {
    if (audiosEl.length === 0) {
      return;
    }
    setIsPlaying(true);
    window.clearInterval(counterIntervalId.current);
    counterIntervalId.current = window.setInterval(() => setCounter((counter: number) => counter + 1), 1000);
    audiosEl.forEach((audio) => {
      audio.play();
    });
  }, [audiosEl]);

  const onPause = React.useCallback(() => {
    setIsPlaying(false);
    window.clearInterval(counterIntervalId.current);
    audiosEl.forEach((audio) => {
      audio.pause();
    });
  }, [audiosEl]);

  const onRestart = React.useCallback(() => {
    setCounter(0);
    audiosEl.forEach((audio) => {
      audio.currentTime = 0;
    });
  }, [audiosEl]);

  const onStop = React.useCallback(() => {
    onPause();
    onRestart();
  }, [onPause, onRestart]);

  const onStartRecord = async () => {
    if (audioContext.current !== null) {
      await audioContext.current.close();
    }

    // create audio context and recorder.
    audioContext.current = new AudioContext();
    const dest = audioContext.current.createMediaStreamDestination();
    for (const audio of audiosEl) {
      const source = audioContext.current.createMediaElementSource(audio);
      source.connect(audioContext.current.destination);
      source.connect(dest);
    }
    recorder.current = new MediaRecorder(dest.stream);
    recorder.current.start();

    // start recording
    setIsRecording(true);
    onRestart();
    onPlay();
    timeoutId.current = window.setTimeout(() => {
      if (recorder.current !== null) {
        recorder.current.ondataavailable = (ev) => {
          onUpdateAudioMix(ev.data);
          setSource(URL.createObjectURL(ev.data));
        };
      }
      onStop();
      setIsRecording(false);
      if (recorder.current) {
        recorder.current.stop();
      }
    }, verseTime * 1000);
  };

  const onStopRecord = () => {
    if (recorder.current) {
      recorder.current.stop();
    }
    window.clearTimeout(timeoutId.current);
    setIsRecording(false);
    onStop();
  };

  const solo = (idx: number) => {
    const newVolumes = volumes.map((volume, index) => {
      const audio = audiosEl[index];
      if (!audio) {
        return 0;
      }
      const newVolume = audio.volume !== 0 ? audio.volume : volume;
      audio.volume = idx !== index ? (solos[idx] ? newVolume : 0) : audio.volume === 0 ? 1 : audio.volume;
      return newVolume;
    });
    setVolumes(newVolumes);
    setSolos((solos: boolean[]) => solos.map((el, index) => (index === idx ? !el : false)));
  };

  const toggleVolume = (idx: number, isMuted: boolean) => {
    audiosEl.forEach((audio, index) => {
      audio.volume = idx === index ? (isMuted ? 1 : 0) : audio.volume;
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
              disabled={isRecording}
            >
              {isPlaying ? 'Pause' : 'Jouer'}
            </Button>
            <span style={{ fontSize: '30px' }}>
              {toTime(counter)}/{toTime(verseTime)}
            </span>
            <Button variant="contained" onClick={onRestart} disabled={isRecording}>
              Recommencer
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            {audiosEl.map((audio, idx) => (
              <AudioMix key={`mix--${idx}`} idx={idx} audio={audio} solo={solo} off={toggleVolume} solos={solos} audioLabels={audioLabels} />
            ))}
          </div>
          {audioSource ? (
            <audio controls={!isRecording} src={audioSource} style={{ width: '95%', height: '40px', marginBottom: '10px', marginLeft: '10px' }} />
          ) : (
            source && <audio controls={!isRecording} src={source} style={{ width: '95%', height: '40px', marginLeft: '10px' }} />
          )}
        </div>
      </div>
      <div style={{ width: '600px', display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
        <Button
          variant="contained"
          style={{ width: '200px', marginTop: '10px', height: '35px' }}
          onClick={isRecording ? onStopRecord : onStartRecord}
        >
          {isRecording ? "Arrêter l'enregistrement" : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
};

export default AudioMixer;

interface AudioMixProps {
  audio: HTMLAudioElement;
  idx: number;
  solo: (idx: number) => void;
  off: (idx: number, isMuted: boolean) => void;
  solos: boolean[];
  audioLabels: string[];
}
const AudioMix = ({ audio, idx, solo, off, solos, audioLabels }: AudioMixProps) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const color = solos[idx] ? 'gold' : 'grey';
  const mutedColor = isMuted ? 'grey' : primaryColor;
  const musicIcons = [PianoIcon, GuitareIcon, TrumpetIcon, FluteIcon, DrumIcon, DrumkitIcon];

  const toggleMute = (idx: number) => {
    setIsMuted(isMuted ? false : true);
    off(idx, isMuted);
  };
  const toggleSolo = (idx: number) => {
    solo(idx);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    audio.volume = newValue as number;
  };

  return (
    <div style={{ width: '100px', padding: '15px' }}>
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
      <span title={audioLabels[idx]}>
        {React.createElement(musicIcons[idx], { key: `descimg--${idx}`, style: { width: '40px', height: '40px', margin: '5px 0px' } })}
      </span>
    </div>
  );
};
