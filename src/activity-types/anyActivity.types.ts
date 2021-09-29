import type { DefiActivity } from './defi.types';
import type { EnigmeActivity } from './enigme.types';
import type { FreeContentActivity } from './freeContent.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';

export type AnyActivity = PresentationActivity | QuestionActivity | EnigmeActivity | DefiActivity | FreeContentActivity;

export type AnyActivityData = AnyActivity['data'];
