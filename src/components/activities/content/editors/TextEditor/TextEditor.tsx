import React from 'react';

import type { EditorProps } from '../../content.types';
import { EditorContainer } from '../EditorContainer';

import { SimpleTextEditor } from './SimpleTextEditor';

export const TextEditor: React.FC<EditorProps> = ({ value = '', onChange = () => {}, onBlur, onFocus, onDelete }: EditorProps) => {
  const confirm = React.useMemo(() => {
    return !value || value.length === 0 || value === '<p></p>' || value === '<p></p>\n';
  }, [value]);

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: confirm ? '' : 'Voulez-vous vraiment supprimer ce texte ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
      noPadding
      noMinHeight
    >
      <SimpleTextEditor value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
    </EditorContainer>
  );
};
