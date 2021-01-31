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
