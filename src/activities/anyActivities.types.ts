import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';

export type AnyActivity = PresentationActivity | QuestionActivity;

export type AnyActivityData = AnyActivity['data'];
