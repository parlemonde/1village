import type { AnthemData } from 'types/anthem.type';
import { TrackType } from 'types/anthem.type';

export const isFirstStepValid = (data: AnthemData): boolean => {
  return !data.tracks.some((track) => track.type !== TrackType.INTRO_CHORUS && track.type !== TrackType.OUTRO && track.sampleUrl.length === 0);
};

export const isSecondStepValid = (data: AnthemData): boolean => {
  if (data.tracks.find((track) => track.type === TrackType.INTRO_CHORUS)?.sampleUrl.length === 0) return false;
  if (data.tracks.find((track) => track.type === TrackType.OUTRO)?.sampleUrl.length === 0) return false;
  return true;
};

export const getErrorSteps = (data: AnthemData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isSecondStepValid(data)) errorSteps.push(1);
  return errorSteps;
};
