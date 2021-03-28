import { GenericExtendedActivity } from './extendedActivity.types';

export type QuestionData = {
  askSame?: string;
};

export type QuestionActivity = GenericExtendedActivity<QuestionData>;
