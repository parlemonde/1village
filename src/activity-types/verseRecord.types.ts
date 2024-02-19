import type { Syllable, Track } from 'src/activity-types/anthem.types';
import type { Activity } from 'types/activity.type';

export type VerseRecordData = {
  tracks: Track[];
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
  verse: string;
  customizedMix: string;
  customizedMixBlob?: Blob;
  mixWithoutLyrics: string;
  classRecord: string;
  slicedRecord: string;
  customizedMixWithVocals: string;
};

export type VerseRecordActivity = Activity<VerseRecordData>;
