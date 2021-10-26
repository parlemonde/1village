import type { DefiActivity } from './defi.types';
import type { EnigmeActivity } from './enigme.types';
import type { FreeContentActivity } from './freeContent.types';
import type { IndiceActivity } from './indice.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';
import type { SymbolActivity } from './symbol.types';

export type AnyActivity =
  | PresentationActivity
  | QuestionActivity
  | EnigmeActivity
  | DefiActivity
  | FreeContentActivity
  | SymbolActivity
  | IndiceActivity;

export type AnyActivityData = AnyActivity['data'];
