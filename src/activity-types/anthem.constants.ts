import { TrackType } from './anthem.types';
import type { AnthemData } from './anthem.types';

export const DEFAULT_ANTHEM_DATA: AnthemData = {
  tracks: [
    {
      type: TrackType.INTRO_CHORUS,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste intro + refrain chanté',
      time: 0,
    },
    {
      type: TrackType.VOCALS,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste vocale La La',
      time: 0,
    },
    {
      type: TrackType.HARMONIC1,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste harmonique 1',
      time: 0,
    },
    {
      type: TrackType.HARMONIC2,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste harmonique 2',
      time: 0,
    },
    {
      type: TrackType.MELODIC1,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste mélodique 1',
      time: 0,
    },
    {
      type: TrackType.MELODIC2,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste mélodique 2',
      time: 0,
    },
    {
      type: TrackType.RYTHMIC1,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste rythmique 1',
      time: 0,
    },
    {
      type: TrackType.RYTHMIC2,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste rythmique 2',
      time: 0,
    },
    {
      type: TrackType.OUTRO,
      iconUrl: '',
      sampleUrl: '',
      label: 'Piste outro',
      time: 0,
    },
  ],
  verseLyrics: [],
  chorusLyrics: [],
};
