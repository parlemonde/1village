import React from 'react';

import Slider from '@mui/material/Slider';
import { Button } from '@mui/material';

import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { ActivityContext } from 'src/contexts/activityContext';
import { primaryColor } from 'src/styles/variables.const';

interface Audio {
  value: string;
  volume: number;
}
interface AudioMixerProps {
  data: Audio[];
  time: number;
}

const AudioMixer: React.FC<AudioMixerProps> = ({ data, time }: AudioMixerProps) => {
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const activityData = (activity?.data as VerseRecordData) || null;
  const [source, setSource] = React.useState(activityData.customizedMix ? activityData.customizedMix : '');
  const [disabled, setDisabled] = React.useState(false);
  const [volumes, setVolumes] = React.useState([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
  const [solos, setSolos] = React.useState([false, false, false, false, false, false]);

  /* eslint-disable-next-line */
    const audiosEl = data.map((audio: Audio) => React.useRef(new Audio(audio.value)));
  const ac = new AudioContext();
  const dest = ac.createMediaStreamDestination();

  audiosEl.map((audio) => (audio.current.onended = () => setIsPlaying(false)));

  const playPause = () => {
    setIsPlaying(isPlaying ? false : true);
    audiosEl.map((audio) => (audio.current.paused ? audio.current.play() : audio.current.pause()));
  };

  const toStart = () => audiosEl.map((audio) => (audio.current.currentTime = 0));

  const recordSounds = () => {
    toStart();
    setDisabled(true);
    audiosEl.map((audio) => {
      const source = ac.createMediaElementSource(audio.current);
      source.connect(ac.destination);
      source.connect(dest);
    });
    const recorder = new MediaRecorder(dest.stream);
    recorder.start();
    recorder.ondataavailable = (ev) => {
      updateActivity({ data: { ...activityData, customizedMixBlob: ev.data } });
      setSource(URL.createObjectURL(ev.data));
    };
    audiosEl.map((audio) => audio.current.play());
    setTimeout(() => recorder.stop(), time * 1000);
  };

  const solo = (idx: number) => {
    let newVolumes: number[] = [];
    audiosEl.map((audio, index) => {
      newVolumes = volumes;
      if (audio.current.volume !== 0) newVolumes[index] = audio.current.volume;
      audio.current.volume = idx !== index ? (solos[idx] ? volumes[index] : 0) : audio.current.volume === 0 ? 1 : audio.current.volume;
    });
    setVolumes(newVolumes);
    setSolos((solos: boolean[]) => solos.map((el, index) => (index === idx ? !el : false)));
  };

  const toggleVolume = (idx: number, isMuted: boolean) => {
    audiosEl.map((audio, index) => {
      audio.current.volume = idx === index ? (isMuted ? 1 : 0) : audio.current.volume;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        {audiosEl.map((audio, idx) => (
          <AudioMix key={`mix--${idx}`} idx={idx} audio={audio} solo={solo} off={toggleVolume} solos={solos} />
        ))}
      </div>

      <div style={{ margin: '100px' }}>
        <Button variant="contained" onClick={playPause} disabled={disabled}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="contained" onClick={recordSounds} disabled={disabled}>
          record
        </Button>
        {source && <audio controls src={source} />}
      </div>
    </div>
  );
};

export default AudioMixer;

interface AudioMixProps {
  audio: React.MutableRefObject<HTMLAudioElement>;
  idx: number;
  solo: (idx: number) => void;
  off: (idx: number, isMuted: boolean) => void;
  solos: boolean[];
}
const AudioMix = ({ audio, idx, solo, off, solos }: AudioMixProps) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const color = solos[idx] ? 'gold' : primaryColor;

  const toggleMute = (idx: number) => {
    setIsMuted(isMuted ? false : true);
    off(idx, isMuted);
  };
  const toggleSolo = (idx: number) => {
    solo(idx);
  };

  // eslint-disable-next-line no-empty-pattern
  const handleChange = ({}, newValue: number | number[]) => {
    audio.current.volume = newValue as number;
  };

  return (
    <div style={{ width: '100px', height: '250px' }}>
      <Slider
        aria-label="Mixing Volume"
        defaultValue={0.5}
        onChange={handleChange}
        axis="y"
        step={0.1}
        marks
        min={0}
        max={1}
        orientation="vertical"
        sx={{
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
        }}
      >
        <span onClick={() => toggleSolo(idx)} style={{ color }}>
          SOLO
        </span>
      </div>
      <div
        style={{
          fontSize: 'smaller',
          borderColor: primaryColor,
          borderStyle: 'solid',
          borderWidth: 'thin',
          width: '40px',
          height: '20px',
          borderRadius: '25px',
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: '20px',
          cursor: 'pointer',
        }}
      >
        <span onClick={() => toggleMute(idx)} style={{ color: primaryColor }}>
          {isMuted ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};
