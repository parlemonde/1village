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
  sampleUrl: string;
  iconUrl: string;
  label: string;
  type: TrackType;
  time: number;
};

export enum TrackType {
  VOCALS = 0,
  HARMONIC1 = 1,
  HARMONIC2 = 2,
  MELODIC1 = 3,
  MELODIC2 = 4,
  RYTHMIC1 = 5,
  RYTHMIC2 = 6,
  INTRO_CHORUS = 7,
  OUTRO = 8,
}

// export type AnthemData = {
//   verseAudios: Track[];
//   introOutro: Track[];
//   verseLyrics: Syllable[];
//   chorus: Syllable[];
//   finalVerse: string;
//   finalMix: string;
//   verseTime: number;
// };

// export type Syllable = {
//   value: string;
//   back: boolean;
// };

// export type Track = {
//   value: string;
//   display: boolean;
//   label: string;
//   type: TrackType;
//   time: number;
// };

// export enum TrackType {
//   VOCALS = 0,
//   HARMONIC1 = 1,
//   HARMONIC2 = 2,
//   MELODIC1 = 3,
//   MELODIC2 = 4,
//   RYTHMIC1 = 5,
//   RYTHMIC2 = 6,
//   INTRO_CHORUS = 7,
//   OUTRO = 8,
// }

export type AnthemActivity = Activity<AnthemData>;
