export interface EditorProps {
  id: number;
  value?: string;
  onChange?(newValue: string): void;
  onDelete?(): void;
  onFocus?(): void;
  onBlur?(): void;
}

export interface ViewProps {
  id: number;
  value?: string;
}
