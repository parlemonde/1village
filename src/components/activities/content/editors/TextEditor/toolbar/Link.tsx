import type { ContentBlock, ContentState } from 'draft-js';
import { RichUtils, EditorState, Modifier } from 'draft-js';
import { getEntityRange, getSelectionEntity } from 'draftjs-utils';
import React from 'react';

import { TextField, Button } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { primaryColor } from 'src/styles/variables.const';

export type LinkValue = {
  link: { target: string; title: string } | null;
  selectionText: string | null;
};

type LinkPickerProps = {
  editorState: EditorState;
  onChange(value: EditorState): void;
  linkModalOpen: boolean;
  setLinkModalOpen(value: boolean): void;
  value: LinkValue;
};

export const LinkPicker = ({ editorState, linkModalOpen, setLinkModalOpen, value, onChange }: LinkPickerProps) => {
  const [link, setLink] = React.useState('');
  const [target, setTarget] = React.useState('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLinkModalOpen(true);
  };

  const handleClickAway = () => {
    setTarget('');
    setLink('');
    setLinkModalOpen(false);
  };

  const prevIsOpen = React.useRef<boolean>(false);
  React.useEffect(() => {
    if (prevIsOpen.current !== linkModalOpen && linkModalOpen) {
      if (value.link === null) {
        setLink(value.selectionText || '');
      } else {
        setLink(value.link.title);
        setTarget(value.link.target);
      }
    }
    prevIsOpen.current = linkModalOpen;
  }, [linkModalOpen, value.link, value.selectionText]);

  const addLink = () => {
    if (!target) {
      return;
    }

    const currentEntity = getSelectionEntity(editorState);
    let selection = editorState.getSelection();

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      const isBackward = selection.getIsBackward();
      if (isBackward) {
        selection = selection.merge({
          anchorOffset: entityRange.end,
          focusOffset: entityRange.start,
        });
      } else {
        selection = selection.merge({
          anchorOffset: entityRange.start,
          focusOffset: entityRange.end,
        });
      }
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', {
        url: target,
        targetOption: '_blank',
        classOption: 'text text--primary',
      })
      .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${link || target}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + (link || target).length,
      focusOffset: selection.get('anchorOffset') + (link || target).length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(newEditorState.getCurrentContent(), selection, ' ', newEditorState.getCurrentInlineStyle(), undefined);
    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    setLinkModalOpen(false);
    setTarget('');
    setLink('');
  };

  const removeLink = () => {
    const currentEntity = getSelectionEntity(editorState);
    let selection = editorState.getSelection();
    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      const isBackward = selection.getIsBackward();
      if (isBackward) {
        selection = selection.merge({
          anchorOffset: entityRange.end,
          focusOffset: entityRange.start,
        });
      } else {
        selection = selection.merge({
          anchorOffset: entityRange.start,
          focusOffset: entityRange.end,
        });
      }
      onChange(RichUtils.toggleLink(editorState, selection, null));
      setLinkModalOpen(false);
      setTarget('');
      setLink('');
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <ToggleButtonGroup
          size="small"
          aria-label="text color"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              m: 0.5,
              border: 'none',
            },
          }}
        >
          <ToggleButton value="bold" aria-label="bold" onMouseDown={handleClick}>
            Lien
          </ToggleButton>
        </ToggleButtonGroup>
        <div style={{ position: 'relative' }}>
          {linkModalOpen && (
            <div style={{ position: 'absolute', left: '-3.5rem', bottom: '-8.5rem', zIndex: 1 }}>
              <Paper elevation={1} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', width: '14rem', padding: '0.2rem' }}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <TextField
                    label="Texte du lien"
                    variant="outlined"
                    value={link}
                    onChange={(event) => {
                      setLink(event.target.value);
                    }}
                    size="small"
                    style={{ margin: '0.25rem 0' }}
                    fullWidth
                  />
                  <TextField
                    label="URL"
                    variant="outlined"
                    value={target}
                    onChange={(event) => {
                      setTarget(event.target.value);
                    }}
                    size="small"
                    style={{ margin: '0.25rem 0' }}
                    fullWidth
                  />
                  <div style={{ width: '100%', textAlign: 'right' }}>
                    <Button color="primary" variant="contained" size="small" onClick={addLink}>
                      {value.link === null ? 'ajouter' : 'modifier'}
                    </Button>
                    {value.link !== null && (
                      <Button color="primary" variant="outlined" size="small" onClick={removeLink} style={{ marginLeft: '0.25rem' }}>
                        supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </Paper>
            </div>
          )}
        </div>
      </div>
    </ClickAwayListener>
  );
};

interface EditorLinkProps {
  entityKey: string;
  contentState: ContentState;
}
const EditorLink = ({ children, entityKey, contentState }: React.PropsWithChildren<EditorLinkProps>) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a href={url} target="_self" style={{ color: primaryColor, textDecoration: 'underline' }}>
      {children}
    </a>
  );
};
export const LinkDecorator = {
  strategy: (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState): void => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
    }, callback);
  },
  component: EditorLink,
};

export const linkToHTML = (
  entity: {
    type: string;
    data: {
      url: string;
    };
  },
  text: string,
): string | undefined => {
  if (entity.type === 'LINK') {
    return `<a href="${entity.data.url}" class="text text--primary" target="_blanck" rel="noopener">${text}</a>`;
  }
  return undefined;
};
