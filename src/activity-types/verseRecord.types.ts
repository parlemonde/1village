import type { Syllable, Track } from 'src/activity-types/anthem.types';
import type { Activity } from 'types/activity.type';

export type ClassAnthemData = {
  verseTracks: Track[];
  verseMixUrl: string;
  verseRecordUrl: string;
  verseFinalMixUrl: string;
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
};

export type ClassAnthemActivity = Activity<ClassAnthemData>;
