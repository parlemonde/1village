import { Activity } from 'types/activity.type';
import { Country } from 'types/country.type';
import { Currency } from 'types/currency.type';
import { Language } from 'types/language.type';

type SimpleObject = { [key: string]: string | number | boolean } | string | number | boolean | Country | Language | Currency;
export type ExtendedActivityData = { [key: string]: string | number | boolean | SimpleObject[] };

export type ExtendedActivity = Activity & {
  data: ExtendedActivityData;
  processedContent: Array<EditorContent>;
  dataId: number;
};

export type EditorTypes = 'text' | 'video' | 'image' | 'h5p';

export type EditorContent = {
  id: number;
  type: EditorTypes;
  value: string;
};

export interface EditorProps {
  id: number;
  value?: string;
  onChange?(newValue: string): void;
  onDelete?(): void;
}

export interface ViewProps {
  id: number;
  value?: string;
}

export interface ActivityViewProps {
  activity: ExtendedActivity;
}
