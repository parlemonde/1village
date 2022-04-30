import type { Syllable, Sample } from 'src/activity-types/anthem.types';
import type { Activity } from 'types/activity.type';

export type VerseRecordData = {
  verseAudios: Sample[];
  introOutro: Sample[];
  verseLyrics: Syllable[];
  chorus: Syllable[];
  verse: string;
  verseStart: number;
  customizedMix: string;
  customizedMixBlob?: Blob;
  verseTime: number;
  mixWithoutLyrics: string;
  classRecord: string;
  slicedRecord: string;
  customizedMixWithVocals: string;
};

export type VerseRecordActivity = Activity<VerseRecordData>;
