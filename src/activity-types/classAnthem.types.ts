import type { Activity } from 'types/activity.type';
import type { Syllable, Track } from 'types/anthem.type';

export type ClassAnthemData = {
  anthemTracks: Track[];
  classRecordTrack: Track;
  verseMixUrl: string; // instrumental tracks
  verseMixWithIntroUrl: string; //verseMixUrl + INTRO_CHORUS track
  verseMixWithVocalsUrl: string; //verseMixUrl + VOCALS track
  verseFinalMixUrl: string; //verseMixUrl + verseRecordUrl
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
};

export type ClassAnthemActivity = Activity<ClassAnthemData>;
