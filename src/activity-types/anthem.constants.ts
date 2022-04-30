import { SampleType } from './anthem.types';
import type { AnthemData } from './anthem.types';

export const DEFAULT_ANTHEM_DATA: AnthemData = {
  verseAudios: [
    {
      type: SampleType.VOCALS,
      value: '',
      label: 'Piste vocale La La',
      display: false,
      time: 0,
    },
    {
      type: SampleType.HARMONIC1,
      value: '',
      label: 'Piste harmonique 1',
      display: false,
      time: 0,
    },
    {
      type: SampleType.HARMONIC2,
      value: '',
      label: 'Piste harmonique 2',
      display: false,
      time: 0,
    },
    {
      type: SampleType.MELODIC1,
      value: '',
      label: 'Piste mélodique 1',
      display: false,
      time: 0,
    },
    {
      type: SampleType.MELODIC2,
      value: '',
      label: 'Piste mélodique 2',
      display: false,
      time: 0,
    },
    {
      type: SampleType.RYTHMIC1,
      value: '',
      label: 'Piste rythmique 1',
      display: false,
      time: 0,
    },
    {
      type: SampleType.RYTHMIC2,
      value: '',
      label: 'Piste rythmique 2',
      display: false,
      time: 0,
    },
  ],
  introOutro: [
    {
      type: SampleType.INTRO_CHORUS,
      value: '',
      label: 'Piste intro + refrain chanté',
      display: false,
      time: 0,
    },
    {
      type: SampleType.OUTRO,
      value: '',
      label: 'Piste outro',
      display: false,
      time: 0,
    },
  ],
  verseLyrics: [],
  chorus: [],
  finalVerse: '',
  finalMix: '',
  verseTime: 0,
};
