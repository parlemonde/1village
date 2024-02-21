import type { Syllable } from 'src/activity-types/anthem.types';
import type { Activity } from 'types/activity.type';

export type VerseRecordData = {
  verseMixUrl: string;
  verseRecordUrl: string;
  verseFinalMixUrl: string;
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
};

export type VerseRecordActivity = Activity<VerseRecordData>;
