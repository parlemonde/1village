import type { Activity } from 'types/activity.type';
import type { Syllable, Track } from 'types/anthem.type';

export type ClassAnthemData = {
  tracks: Track[];
  verseStartTime: number;
  verseMixUrl: string; //mixed verse instrumental tracks
  verseRecordUrl: string; //class voices record
  verseMixWithIntroUrl: string; //verseMixUrl + INTRO_CHORUS track
  verseMixWithVocalsUrl: string; //verseMixUrl + VOCALS track
  verseMixWithLyricsUrl: string; //verseMixUrl + verseRecordUrl
  verseFinalMixUrl: string;
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
};

export type ClassAnthemActivity = Activity<ClassAnthemData>;
