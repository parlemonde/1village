import type { ChallengeActivity } from './challenge.types';
import type { EnigmeActivity } from './enigme.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';

export type AnyActivity = PresentationActivity | QuestionActivity | EnigmeActivity | ChallengeActivity;

export type AnyActivityData = AnyActivity['data'];
