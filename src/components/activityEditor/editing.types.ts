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

export interface PreviewProps {
  id: number;
  value?: string;
}
