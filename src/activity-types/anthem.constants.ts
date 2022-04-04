import type { AnthemData } from './anthem.types';

export const DEFAULT_ANTHEM_DATA: AnthemData = {
  verseAudios: [
    {
      type: 0,
      value: '',
      label: 'Piste vocale La La',
      display: false,
    },
    {
      type: 1,
      value: '',
      label: 'Piste harmonique 1',
      display: false,
    },
    {
      type: 2,
      value: '',
      label: 'Piste harmonique 2',
      display: false,
    },
    {
      type: 3,
      value: '',
      label: 'Piste mélodique 1',
      display: false,
    },
    {
      type: 4,
      value: '',
      label: 'Piste mélodique 2',
      display: false,
    },
    {
      type: 5,
      value: '',
      label: 'Piste rythmique 1',
      display: false,
    },
    {
      type: 6,
      value: '',
      label: 'Piste rythmique 2',
      display: false,
    },
  ],
  introOutro: [
    {
      type: 7,
      value: '',
      label: 'Piste intro + refrain chanté',
      display: false,
    },
    {
      type: 8,
      value: '',
      label: 'Piste outro',
      display: false,
    },
  ],
  verse: [],
  chorus: [],
  finalVerse: '',
  finalMix: '',
  verseTime: 0,
};
