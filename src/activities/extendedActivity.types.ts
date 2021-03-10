import { Activity } from 'types/activity.type';

export type EditorTypes = 'text' | 'video' | 'image' | 'h5p';

export type EditorContent = {
  id: number;
  type: EditorTypes;
  value: string;
};

export type GenericExtendedActivity<T> = Activity & {
  data: T;
  processedContent: Array<EditorContent>;
  dataId: number;
};
