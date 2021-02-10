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
  isPreview: boolean;
}

export interface ActivityViewProps {
  activity: ExtendedActivity;
  isPreview?: boolean;
}
