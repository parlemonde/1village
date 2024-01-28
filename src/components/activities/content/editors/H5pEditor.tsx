import Link from 'next/link';
import React from 'react';

import { Button, Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';

import type { EditorProps } from '../content.types';
import { EditorContainer } from './EditorContainer';
import { useH5pContentList } from 'src/api/h5p/h5p-content.list';
import { H5p } from 'src/components/H5pOLD';
import { Modal } from 'src/components/Modal';
import H5pPlayer from 'src/components/h5p/H5pPlayer';
import { UserContext } from 'src/contexts/userContext';
import { fontDetailColor } from 'src/styles/variables.const';
import { UserType } from 'types/user.type';

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
  const { user } = React.useContext(UserContext);
  const isAdmin = user && user.type <= UserType.ADMIN;
  const [isModalOpen, setIsModalOpen] = React.useState(value === '');
  const [inputValue, setInputValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const { data: h5pContent } = useH5pContentList();

  const contentId = value.match(/^\/h5p\/data\/([\w|-]+)\/play$/)?.[1] ?? null;

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

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>{contentId ? <H5pPlayer contentId={contentId} /> : <H5p src={value} />}</div>

      <Modal
        open={isModalOpen}
        fullWidth
        noCloseOutsideModal
        maxWidth="md"
        title="Choisir le contenu"
        noCancelButton
        onClose={() => {
          setIsModalOpen(false);
          if (value.length === 0) {
            onDelete();
          }
        }}
        ariaLabelledBy={`h5p-edit-${id}`}
        ariaDescribedBy={`h5p-edit-${id}-desc`}
      >
        <h3>Choisissez le contenu H5P :</h3>
        {h5pContent && h5pContent.length > 0 ? (
          <FormControl fullWidth>
            <InputLabel id="select-h5p">Contenu H5P</InputLabel>
            <Select
              labelId="select-h5p"
              id="select-h5p"
              label="Contenu H5P"
              onChange={(event) => {
                onChange(`/h5p/data/${event.target.value}/play`);
                setIsModalOpen(false);
              }}
            >
              {h5pContent.map((h5p) => (
                <MenuItem key={h5p.contentId} value={h5p.contentId}>
                  {h5p.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <>
            <p style={{ margin: '0.25rem 0' }}>
              {"Vous n'avez pas encore de contenu H5P sur 1village. Vous pouvez en créer un sur l'interface admin."}
            </p>
            {isAdmin && (
              <div className="text-center">
                <Link href="/admin/h5p" passHref>
                  <Button
                    component="a"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                    style={{ marginTop: '0.5rem' }}
                    size="small"
                  >
                    Créer un contenu H5P
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
        <Divider style={{ marginTop: '2rem' }} />
        <div className="text-center" style={{ margin: '-0.8rem 0 1.5rem 0' }}>
          <span style={{ backgroundColor: 'white', padding: '0 0.5rem', color: fontDetailColor, fontSize: '1.1rem' }}>Ou</span>
        </div>
        <h3>Entrez le lien H5P externe :</h3>
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
        <Button
          variant="contained"
          color="primary"
          style={{ float: 'right', marginTop: '0.5rem' }}
          onClick={() => {
            const url = extractSrcValue(inputValue);
            if (url !== null) {
              onChange(url);
              setIsModalOpen(false);
            }
          }}
          disabled={!isValid}
        >
          Choisir
        </Button>
      </Modal>
    </EditorContainer>
  );
};
