import { TrackType } from './anthem.types';
import type { AnthemData } from './anthem.types';

export const DEFAULT_ANTHEM_DATA: AnthemData = {
  tracks: [
    {
      type: TrackType.INTRO_CHORUS,
      label: 'Piste intro + refrain chanté',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.VOCALS,
      label: 'Piste vocale La La',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.HARMONIC1,
      label: 'Piste harmonique 1',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.HARMONIC2,
      label: 'Piste harmonique 2',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.MELODIC1,
      label: 'Piste mélodique 1',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.MELODIC2,
      label: 'Piste mélodique 2',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.RYTHMIC1,
      label: 'Piste rythmique 1',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.RYTHMIC2,
      label: 'Piste rythmique 2',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
    {
      type: TrackType.OUTRO,
      label: 'Piste outro',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
    },
  ],
  verseLyrics: [],
  chorusLyrics: [],
};
