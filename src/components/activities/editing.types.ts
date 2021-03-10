import type { AnyActivity } from 'src/activities/anyActivities.types';

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
  activity: AnyActivity;
}
