import type { DefiActivity } from './defi.types';
import type { EnigmeActivity } from './enigme.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';
import type { GameActivity } from './game.types';

export type AnyActivity = PresentationActivity | QuestionActivity | EnigmeActivity | DefiActivity | GameActivity;

export type AnyActivityData = AnyActivity['data'];
