import { Activity } from 'types/activity.type';

export type EditorTypes = 'text' | 'video' | 'image' | 'h5p' | 'sound';

export type EditorContent = {
  id: number;
  type: EditorTypes;
  value: string;
};

export type GenericExtendedActivity<T> = Activity & {
  data: T & { draftUrl?: string };
  processedContent: Array<EditorContent>;
  dataId: number;
};
