export interface EditorProps {
  id?: number | null;
  value?: string;
  onChange?(newValue: string): void;
  onDelete?(): void;
  onFocus?(): void;
  onBlur?(): void;
  isRounded?: boolean;
}

export interface ViewProps {
  id: number;
  value?: string;
}
