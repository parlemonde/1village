import type { AnthemData } from 'src/activity-types/anthem.types';
import { TrackType } from 'src/activity-types/anthem.types';

const isVersesEqualDuration = (data: AnthemData) => {
  const versesDuration = data.tracks
    .filter((track) => track.type !== TrackType.INTRO_CHORUS && track.type !== TrackType.OUTRO && track.sampleDuration > 1)
    .map((track) => track.sampleDuration);

  return versesDuration.every((duration) => duration === versesDuration[0]);
};

export const isFirstStepValid = (data: AnthemData): boolean => {
  if (isVersesEqualDuration(data) === false) return false;
  return true;
};

export const getErrorSteps = (data: AnthemData, step: number) => {
  const errorSteps = [];

  if (step === 0 && !isFirstStepValid(data)) errorSteps.push(0);
  return errorSteps;
};
