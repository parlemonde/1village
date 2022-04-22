import React from 'react';

import Slider from '@mui/material/Slider';
import { Button } from '@mui/material';

import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { ActivityContext } from 'src/contexts/activityContext';
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

const AudioMixer: React.FC = () => {
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const activityData = (activity?.data as VerseRecordData) || null;
  const data = activityData?.verseAudios?.slice(1).map((audio) => ({ value: audio.value, volume: 0.5 }));
  const time = activityData?.verseTime;
  const [source, setSource] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [volumes, setVolumes] = React.useState([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
  const [solos, setSolos] = React.useState([false, false, false, false, false, false]);
  const [timeLeft, setTimeLeft] = React.useState(time);
  const [ac, setAc] = React.useState<AudioContext>(new AudioContext());
  const [intervalId, setIntervalId] = React.useState<number>();
  const [audioSources, setAudioSources] = React.useState<(MediaElementAudioSourceNode | undefined)[]>([]);
  const recorder = React.useRef<MediaRecorder>();

  React.useEffect(() => {
    setAc(new AudioContext());
  }, []);

  /* eslint-disable-next-line */
  const audiosEl = data.map((audio: Audio) => React.useRef(new Audio(audio.value)));

  audiosEl.map((audio) => (audio.current.onended = () => setIsPlaying(false)));

  const playPause = () => {
    setIsPlaying(isPlaying ? false : true);
    audiosEl.map((audio) => (audio.current.paused ? audio.current.play() : audio.current.pause()));
  };

  const toStart = () => audiosEl.map((audio) => (audio.current.currentTime = 0));

  const recordSounds = () => {
    toStart();
    setIntervalId(window.setInterval(() => setTimeLeft((timeLeft: number) => timeLeft - 1), 1000));
    setIsRecording(true);
    ac.resume();
    const dest = ac.createMediaStreamDestination();
    const sources = audioSources;
    audiosEl.map((audio, index) => {
      if (sources.length !== 6) sources[index] = ac.createMediaElementSource(audio.current);
      sources?.[index]?.connect(ac.destination);
      sources?.[index]?.connect(dest);
    });
    setAudioSources(sources);
    recorder.current = new MediaRecorder(dest.stream);
    recorder?.current.start();
    recorder.current.ondataavailable = (ev) => {
      updateActivity({ data: { ...activityData, customizedMixBlob: ev.data } });
      setSource(URL.createObjectURL(ev.data));
    };
    setIsPlaying(true);
    audiosEl.map((audio) => audio.current.play());
    setTimeout(() => {
      setIsRecording(false);
      recorder?.current?.stop();
    }, time * 1000);
  };
  const stopRecord = () => {
    setIsRecording(false);
    playPause();
    toStart();
    clearInterval(intervalId);
    setTimeLeft(time);
    recorder?.current?.stop();
  };

  const solo = (idx: number) => {
    const newVolumes: number[] = volumes;
    audiosEl.map((audio, index) => {
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

  if (timeLeft < 1) {
    clearInterval(intervalId);
  }

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
            <Button variant="contained" onClick={playPause} disabled={isRecording}>
              {isPlaying ? 'Pause' : 'Jouer'}
            </Button>
            <Button variant="contained" onClick={toStart} disabled={isRecording}>
              Recommencer
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            {audiosEl.map((audio, idx) => (
              <AudioMix key={`mix--${idx}`} idx={idx} audio={audio} solo={solo} off={toggleVolume} solos={solos} />
            ))}
          </div>
          {activityData?.customizedMix ? (
            <audio
              controls={!isRecording}
              src={activityData.customizedMix}
              style={{ width: '95%', height: '40px', marginBottom: '10px', marginLeft: '10px' }}
            />
          ) : (
            source && <audio controls={!isRecording} src={source} style={{ width: '95%', height: '40px', marginLeft: '10px' }} />
          )}
        </div>
      </div>
      <div style={{ width: '600px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ width: '200px', fontSize: '50px' }}>{isRecording && toTime(timeLeft)}</span>
        <Button variant="contained" style={{ width: '200px', marginTop: '10px', height: '35px' }} onClick={isRecording ? stopRecord : recordSounds}>
          {isRecording ? "Arrêter l'enregistrement" : 'Enregistrer'}
        </Button>
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

  // eslint-disable-next-line no-empty-pattern
  const handleChange = ({}, newValue: number | number[]) => {
    audio.current.volume = newValue as number;
  };

  return (
    <div style={{ width: '100px', padding: '15px' }}>
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
      {React.createElement(musicIcons[idx], { key: `descimg--${idx}`, style: { width: '40px', height: '40px', margin: '5px 0px' } })}
    </div>
  );
};
