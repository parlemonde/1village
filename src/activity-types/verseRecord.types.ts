import type { Activity } from 'types/activity.type';
import type { Syllable, Track } from 'types/anthem.type';

export type ClassAnthemData = {
  verseTracks: Track[];
  verseMixUrl: string;
  verseRecordUrl: string;
  verseFinalMixUrl: string;
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
};

export type ClassAnthemActivity = Activity<ClassAnthemData>;
