import { Activity } from 'types/activity.type';

export type ExtendedActivity = Activity & {
  data: { [key: string]: string | number | boolean };
  processedContent: Array<EditorContent>;
  dataId: number;
};

export type EditorTypes = 'text' | 'video' | 'image' | 'h5p';

export type EditorContent = {
  id: number;
  type: EditorTypes;
  value: string | File;
};

export interface EditorProps<ValueType = string> {
  id: number;
  value?: ValueType;
  onChange?(newValue: ValueType): void;
  onDelete?(): void;
}

export interface ViewProps<ValueType = string> {
  id: number;
  value?: ValueType;
  isPreview: boolean;
}

export interface ActivityViewProps {
  activity: ExtendedActivity;
  isPreview?: boolean;
}
