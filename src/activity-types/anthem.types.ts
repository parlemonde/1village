import type { Activity } from 'types/activity.type';

export type AnthemData = {
  tracks: Track[];
  verseLyrics: Syllable[];
  chorusLyrics: Syllable[];
};

export type Syllable = {
  value: string;
  back: boolean;
};

export type Track = {
  type: TrackType;
  label: string;
  sampleUrl: string;
  sampleDuration: number;
  sampleStartTime: number;
  iconUrl: string;
};

export enum TrackType {
  INTRO_CHORUS = 0,
  VOCALS = 1,
  HARMONIC1 = 2,
  HARMONIC2 = 3,
  MELODIC1 = 4,
  MELODIC2 = 5,
  RYTHMIC1 = 6,
  RYTHMIC2 = 7,
  OUTRO = 8,
}

export type AnthemActivity = Activity<AnthemData>;
