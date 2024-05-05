import type { MigrationInterface, QueryRunner } from 'typeorm';

import type { AnthemData } from '../../types/anthem.type';
import type { ClassAnthemData } from '../../types/classAnthem.types';

enum SampleType {
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
type Syllable = {
  value: string;
  back: boolean;
};
type Sample = {
  value: string;
  display: boolean;
  label: string;
  type: SampleType;
  time: number;
};
type OldAnthemData = {
  verseAudios: Sample[];
  introOutro: Sample[];
  verseLyrics: Syllable[];
  chorus: Syllable[];
  finalVerse: string;
  finalMix: string;
  verseTime: number;
};
type OldVerseData = {
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

const sampleTypeToTrackType = {
  [SampleType.VOCALS]: 1,
  [SampleType.HARMONIC1]: 2,
  [SampleType.HARMONIC2]: 3,
  [SampleType.MELODIC1]: 4,
  [SampleType.MELODIC2]: 5,
  [SampleType.RYTHMIC1]: 6,
  [SampleType.RYTHMIC2]: 7,
  [SampleType.INTRO_CHORUS]: 0,
  [SampleType.OUTRO]: 8,
};
const trackTypeToSampleType = {
  1: SampleType.VOCALS,
  2: SampleType.HARMONIC1,
  3: SampleType.HARMONIC2,
  4: SampleType.MELODIC1,
  5: SampleType.MELODIC2,
  6: SampleType.RYTHMIC1,
  7: SampleType.RYTHMIC2,
  0: SampleType.INTRO_CHORUS,
  8: SampleType.OUTRO,
  9: SampleType.VOCALS,
};

type NewAnthemData = AnthemData;
type NewVerseData = ClassAnthemData;

const isOldAnthemData = (data: unknown): data is OldAnthemData => typeof data === 'object' && data !== null && 'introOutro' in data;
const isOldVerseData = (data: unknown): data is OldVerseData => typeof data === 'object' && data !== null && 'introOutro' in data;

const isNewAnthemData = (data: unknown): data is NewAnthemData => typeof data === 'object' && data !== null && 'tracks' in data;
const isNewVerseData = (data: unknown): data is NewVerseData => typeof data === 'object' && data !== null && 'tracks' in data;

export class NewAnthemData1714929595777 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update current anthems and verses to use new data structure

    const anthems: { id: number; data: unknown }[] = await queryRunner.query('SELECT `id`, `data` FROM `activity` WHERE `type` = 11');
    for (const { id, data } of anthems) {
      if (isOldAnthemData(data)) {
        const newData: NewAnthemData = {
          tracks: [
            ...data.verseAudios.map((sample) => ({
              type: sampleTypeToTrackType[sample.type],
              label: sample.label,
              sampleUrl: sample.value,
              sampleDuration: sample.time,
              sampleStartTime: 0,
              sampleVolume: 0.5,
              iconUrl: 'accordion',
            })),
            ...data.introOutro.map((sample) => ({
              type: sampleTypeToTrackType[sample.type],
              label: sample.label,
              sampleUrl: sample.value,
              sampleDuration: 0,
              sampleStartTime: 0,
              sampleVolume: 0.5,
              iconUrl: 'accordion',
            })),
          ],
          verseLyrics: data.verseLyrics,
          chorusLyrics: data.chorus,
          mixUrl: data.finalVerse,
          fullMixUrl: data.finalMix,
        };
        await queryRunner.query('UPDATE `activity` SET `data` = ? WHERE `id` = ?', [JSON.stringify(newData), id]);
      }
    }

    const verses: { id: number; data: unknown }[] = await queryRunner.query('SELECT `id`, `data` FROM `activity` WHERE `type` = 12');
    for (const { id, data } of verses) {
      if (isOldVerseData(data)) {
        const newData: NewVerseData = {
          anthemTracks: [
            ...data.verseAudios.map((sample) => ({
              type: sampleTypeToTrackType[sample.type],
              label: sample.label,
              sampleUrl: sample.value,
              sampleDuration: sample.time,
              sampleStartTime: 0,
              sampleVolume: 0.5,
              iconUrl: 'accordion',
            })),
            ...data.introOutro.map((sample) => ({
              type: sampleTypeToTrackType[sample.type],
              label: sample.label,
              sampleUrl: sample.value,
              sampleDuration: 0,
              sampleStartTime: 0,
              sampleVolume: 0.5,
              iconUrl: 'accordion',
            })),
          ],
          classRecordTrack: {
            type: 9,
            label: '',
            sampleUrl: data.classRecord,
            sampleDuration: data.verseTime,
            sampleStartTime: data.verseStart,
            sampleVolume: 1,
            iconUrl: 'accordion',
          },
          verseLyrics: data.verseLyrics,
          chorusLyrics: data.chorus,
          verseMixUrl: data.mixWithoutLyrics,
          verseMixWithIntroUrl: '',
          verseMixWithVocalsUrl: data.customizedMix,
          verseFinalMixUrl: data.customizedMixWithVocals,
        };
        await queryRunner.query('UPDATE `activity` SET `data` = ? WHERE `id` = ?', [JSON.stringify(newData), id]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert current anthems and verses to use old data structure

    const anthems: { id: number; data: unknown }[] = await queryRunner.query('SELECT `id`, `data` FROM `activity` WHERE `type` = 11');
    for (const { id, data } of anthems) {
      if (isNewAnthemData(data)) {
        const newData: OldAnthemData = {
          verseAudios: data.tracks
            .filter((track) => track.type !== 0 && track.type !== 8)
            .map((track) => ({
              value: track.sampleUrl,
              display: true,
              label: track.label,
              type: trackTypeToSampleType[track.type],
              time: track.sampleDuration,
            })),
          introOutro: data.tracks
            .filter((track) => track.type === 0 || track.type === 8)
            .map((track) => ({
              value: track.sampleUrl,
              display: true,
              label: track.label,
              type: trackTypeToSampleType[track.type],
              time: track.sampleDuration,
            })),
          verseLyrics: data.verseLyrics,
          chorus: data.chorusLyrics,
          finalVerse: data.mixUrl ?? '',
          finalMix: data.fullMixUrl ?? '',
          verseTime: data.tracks.find((track) => track.type === 1)?.sampleDuration ?? 0,
        };
        await queryRunner.query('UPDATE `activity` SET `data` = ? WHERE `id` = ?', [JSON.stringify(newData), id]);
      }
    }

    const verses: { id: number; data: unknown }[] = await queryRunner.query('SELECT `id`, `data` FROM `activity` WHERE `type` = 12');
    for (const { id, data } of verses) {
      if (isNewVerseData(data)) {
        const newData: OldVerseData = {
          verseAudios: data.anthemTracks
            .filter((track) => track.type !== 0 && track.type !== 8)
            .map((track) => ({
              value: track.sampleUrl,
              display: true,
              label: track.label,
              type: trackTypeToSampleType[track.type],
              time: track.sampleDuration,
            })),
          introOutro: data.anthemTracks
            .filter((track) => track.type === 0 || track.type === 8)
            .map((track) => ({
              value: track.sampleUrl,
              display: true,
              label: track.label,
              type: trackTypeToSampleType[track.type],
              time: track.sampleDuration,
            })),
          verseLyrics: data.verseLyrics,
          chorus: data.chorusLyrics,
          verse: '',
          verseStart: data.classRecordTrack.sampleStartTime,
          customizedMix: data.verseMixWithVocalsUrl,
          verseTime: data.classRecordTrack.sampleDuration,
          mixWithoutLyrics: data.verseMixUrl,
          classRecord: data.classRecordTrack.sampleUrl,
          slicedRecord: data.classRecordTrack.sampleUrl,
          customizedMixWithVocals: data.verseFinalMixUrl,
        };
        await queryRunner.query('UPDATE `activity` SET `data` = ? WHERE `id` = ?', [JSON.stringify(newData), id]);
      }
    }
  }
}
