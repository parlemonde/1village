import type { EnigmeActivity } from './enigme.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';

export type AnyActivity = PresentationActivity | QuestionActivity | EnigmeActivity;

export type AnyActivityData = AnyActivity['data'];
