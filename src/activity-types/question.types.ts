import type { Activity } from 'types/activity.type';

export type QuestionData = {
  askSame?: string;
};

export type QuestionActivity = Activity<QuestionData>;
