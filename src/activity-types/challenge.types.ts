import { GenericExtendedActivity } from './extendedActivity.types';

export type CookingChallengeData = {
  image?: string;
  name: string;
  history: string;
  explanation: string;
  challengeIndex: number;
  challenge?: string;
};

export type CookingChallengeActivity = GenericExtendedActivity<CookingChallengeData>;

export type ChallengeActivity = CookingChallengeActivity;
