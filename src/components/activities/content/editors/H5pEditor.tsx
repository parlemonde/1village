import React from 'react';

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

import type { EditorProps } from '../content.types';
import { EditorContainer } from './EditorContainer';
import { H5p } from 'src/components/H5pOLD';
import { Modal } from 'src/components/Modal';

const IFRAME_REGEX = /<\s*iframe([^>]*)>.*?<\s*\/\s*iframe>/im;
const SRC_REGEX = /src\s*=\s*"(.+?)"/im;

const extractSrcValue = (value: string): string | null => {
  const iframeMatch = IFRAME_REGEX.exec(value);
  if (iframeMatch !== null && iframeMatch.length > 0) {
    const srcMatch = SRC_REGEX.exec(iframeMatch[0]);
    if (srcMatch !== null && srcMatch.length > 1) {
      return srcMatch[1];
    }
  }
  return null;
};

export const H5pEditor = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(value === '');
  const [inputValue, setInputValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsValid(extractSrcValue(event.target.value) !== null);
  };

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer ce contenu h5p ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
    >
      <div className="text-center" style={{ marginBottom: '0.25rem' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Modifier
        </Button>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <H5p src={value} />
      </div>

      <Modal
        open={isModalOpen}
        fullWidth
        noCloseOutsideModal
        maxWidth="md"
        title="Choisir le contenu"
        confirmLabel="Choisir"
        onConfirm={() => {
          const url = extractSrcValue(inputValue);
          if (url !== null) {
            onChange(url);
            setIsModalOpen(false);
          }
        }}
        onClose={() => {
          setIsModalOpen(false);
          if (value.length === 0) {
            onDelete();
          }
        }}
        disabled={!isValid}
        ariaLabelledBy={`h5p-edit-${id}`}
        ariaDescribedBy={`h5p-edit-${id}-desc`}
      >
        <TextField
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          onBlur={onBlur}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          placeholder="Entrez le contenu h5p ici. (<iframe ..... />)"
        />
      </Modal>
    </EditorContainer>
  );
};
