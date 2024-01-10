import { TrackType } from './anthem.types';
import type { AnthemData } from './anthem.types';

export const DEFAULT_ANTHEM_DATA: AnthemData = {
  tracks: [
    {
      type: TrackType.INTRO_CHORUS,
      value: '',
      label: 'Piste intro + refrain chanté',
      display: false,
      time: 0,
    },
    {
      type: TrackType.VOCALS,
      value: '',
      label: 'Piste vocale La La',
      display: false,
      time: 0,
    },
    {
      type: TrackType.HARMONIC1,
      value: '',
      label: 'Piste harmonique 1',
      display: false,
      time: 0,
    },
    {
      type: TrackType.HARMONIC2,
      value: '',
      label: 'Piste harmonique 2',
      display: false,
      time: 0,
    },
    {
      type: TrackType.MELODIC1,
      value: '',
      label: 'Piste mélodique 1',
      display: false,
      time: 0,
    },
    {
      type: TrackType.MELODIC2,
      value: '',
      label: 'Piste mélodique 2',
      display: false,
      time: 0,
    },
    {
      type: TrackType.RYTHMIC1,
      value: '',
      label: 'Piste rythmique 1',
      display: false,
      time: 0,
    },
    {
      type: TrackType.RYTHMIC2,
      value: '',
      label: 'Piste rythmique 2',
      display: false,
      time: 0,
    },
    {
      type: TrackType.OUTRO,
      value: '',
      label: 'Piste outro',
      display: false,
      time: 0,
    },
  ],
  verseLyrics: [],
  chorusLyrics: [],
};
