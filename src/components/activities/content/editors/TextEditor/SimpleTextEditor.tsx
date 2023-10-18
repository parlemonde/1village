import { Divider } from '@mui/material';
import Paper from '@mui/material/Paper';
import classnames from 'classnames';
import type { DraftHandleValue, DraftEditorCommand, ContentBlock } from 'draft-js';
import { Editor, RichUtils, CompositeDecorator, ContentState, convertToRaw, EditorState, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {
  setBlockData,
  getSelectedBlock,
  getSelectionEntity,
  getSelectionText,
  getEntityRange,
  getSelectionInlineStyle,
  extractInlineStyle,
  getCustomStyleMap,
  getSelectionCustomInlineStyle,
  toggleCustomInlineStyle,
} from 'draftjs-utils';
import htmlToDraft from 'html-to-draftjs';
import React from 'react';

import { ColorPicker } from './toolbar/ColorPicker';
import { EmojiPicker } from './toolbar/EmojiPicker';
import { InlineButtons } from './toolbar/InlineButtons';
import type { LinkValue } from './toolbar/Link';
import { LinkPicker, LinkDecorator, linkToHTML } from './toolbar/Link';
import { TextAlignButtons } from './toolbar/TextAlignButtons';
import { TitleChoice } from './toolbar/TitleChoice';
import { errorColor, fontDetailColor, primaryColor } from 'src/styles/variables.const';

function blockStyleFn(block: ContentBlock): string {
  const blockAlignment = block.getData() && block.getData().get('text-align');
  if (blockAlignment) {
    return `${blockAlignment}-aligned-block`;
  }
  return '';
}

interface SimpleTextEditorProps {
  value: string;
  onChange?(newValue: string, newLength: number): boolean | void;
  onFocus?(): void;
  onBlur?(): void;
  placeholder?: string;
  inlineToolbar?: boolean;
  withBorder?: boolean;
  noBlock?: boolean;
  maxLen?: number;
  error?: boolean;
}

export const SimpleTextEditor = ({
  value = '',
  placeholder = 'Commencez à écrire ici, ou ajoutez une vidéo ou une image.',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  inlineToolbar = false,
  withBorder = false,
  noBlock = false,
  maxLen,
  error = false,
}: SimpleTextEditorProps) => {
  const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty(new CompositeDecorator([LinkDecorator])));
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const editorContainerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<Editor>(null);

  const previousValue = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (value !== previousValue.current) {
      previousValue.current = value;
      const { contentBlocks, entityMap } = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const newEditorState = EditorState.createWithContent(contentState, new CompositeDecorator([LinkDecorator]));
      extractInlineStyle(newEditorState);
      setEditorState(newEditorState);
    }
  }, [value]);

  // -- text length
  const getLengthOfSelectedText = () => {
    const currentSelection = editorState.getSelection();
    const isCollapsed = currentSelection.isCollapsed();
    let length = 0;
    if (!isCollapsed) {
      const currentContent = editorState.getCurrentContent();
      const startKey = currentSelection.getStartKey();
      const endKey = currentSelection.getEndKey();
      const startBlock = currentContent.getBlockForKey(startKey);
      const isStartAndEndBlockAreTheSame = startKey === endKey;
      const startBlockTextLength = startBlock.getLength();
      const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
      const endSelectedTextLength = currentSelection.getEndOffset();
      const keyAfterEnd = currentContent.getKeyAfter(endKey);
      if (isStartAndEndBlockAreTheSame) {
        length += currentSelection.getEndOffset() - currentSelection.getStartOffset();
      } else {
        let currentKey = startKey;
        while (currentKey && currentKey !== keyAfterEnd) {
          if (currentKey === startKey) {
            length += startSelectedTextLength + 1;
          } else if (currentKey === endKey) {
            length += endSelectedTextLength;
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1;
          }
          currentKey = currentContent.getKeyAfter(currentKey);
        }
      }
    }
    return length;
  };

  const handleBeforeInput = (): DraftHandleValue => {
    if (!maxLen) {
      return 'not-handled';
    }

    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = getLengthOfSelectedText();
    if (currentContentLength - selectedTextLength > maxLen - 1) {
      return 'handled';
    }
    return 'not-handled';
  };

  const handlePastedText = (pastedText: string): DraftHandleValue => {
    if (!maxLen) {
      return 'not-handled';
    }

    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = getLengthOfSelectedText();
    if (currentContentLength + pastedText.length - selectedTextLength > maxLen) {
      return 'handled';
    }
    return 'not-handled';
  };

  const onEditorChange = (newEditorState: EditorState) => {
    const newHTMLValue = draftToHtml(convertToRaw(newEditorState.getCurrentContent()), undefined, undefined, linkToHTML);
    previousValue.current = newHTMLValue.includes('/activite/') ? '' : newHTMLValue;
    const content = editorState.getCurrentContent();
    const success = onChange(newHTMLValue, content.getPlainText('').length);
    if (success === undefined || success) {
      setEditorState(newEditorState);
    }
  };

  const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      onEditorChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  // --- Current values ---
  const { currentInlineStyle, currentAlignment, currentHeader, currentColor } = React.useMemo(() => {
    const currentBlock: ContentBlock = getSelectedBlock(editorState);
    return {
      currentInlineStyle: getSelectionInlineStyle(editorState),
      currentAlignment: currentBlock.getData().get('text-align') || 'left',
      currentHeader: currentBlock.getType(),
      currentColor: (getSelectionCustomInlineStyle(editorState, ['COLOR']).COLOR || '-').split('-')[1] || '',
    };
  }, [editorState]);

  // ----- Inline style -----
  const setInlineStyle = (inlineStyle: 'BOLD' | 'ITALIC' | 'UNDERLINE', value: boolean) => {
    if (currentInlineStyle[inlineStyle] !== value) {
      onEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }
  };

  // --- Color style ---
  const setInlineColor = (value: string) => {
    // default text color
    if (value === 'rgb(46, 52, 59)') {
      if (currentColor) {
        onEditorChange(toggleCustomInlineStyle(editorState, 'color', currentColor));
      }
    } else {
      if (currentColor !== value) {
        onEditorChange(toggleCustomInlineStyle(editorState, 'color', value));
      }
    }
  };

  // --- Links ---
  const currentLink = React.useMemo(() => {
    const currentEntity = getSelectionEntity(editorState);
    const contentState = editorState.getCurrentContent();
    const currentValues: LinkValue = { link: null, selectionText: null };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (currentEntity && contentState.getEntity(currentEntity).get('type') === 'LINK') {
      const entityRange = currentEntity && getEntityRange(editorState, currentEntity);
      currentValues.link = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        target: currentEntity && contentState.getEntity(currentEntity).get('data').url,
        title: entityRange && entityRange.text,
      };
    }
    currentValues.selectionText = getSelectionText(editorState);
    return currentValues;
  }, [editorState]);

  // --- Block style ---
  const toggleBlockType = (blockType: string) => {
    onEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  // --- Text Align ---
  const setBlockAlignmentData = (value: 'left' | 'center' | 'right') => {
    onEditorChange(setBlockData(editorState, { 'text-align': value === 'left' ? undefined : value }));
  };

  // --- Emoji ---
  const addEmoji = (emoji: string) => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji,
      editorState.getCurrentInlineStyle(),
    );
    onEditorChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  const hasFocus = React.useMemo(() => {
    const selection = editorState.getSelection();
    return selection.getHasFocus();
  }, [editorState]);

  const displayPlaceholder = React.useMemo(() => {
    return !value || value.length === 0 || value === '<p></p>' || value === '<p></p>\n';
  }, [value]);

  const toolbar = (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
      }}
      style={
        withBorder
          ? {
              margin: '-1px',
              borderColor: !error ? primaryColor : errorColor,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }
          : {}
      }
    >
      <>
        <InlineButtons value={currentInlineStyle} onChange={setInlineStyle} />
        {noBlock || (
          <>
            <Divider flexItem orientation="vertical" sx={{ my: 1, mx: 0.5 }} />
            <TextAlignButtons value={currentAlignment} onChange={setBlockAlignmentData} />
            <Divider flexItem orientation="vertical" sx={{ my: 1, mx: 0.5 }} />
            <TitleChoice value={currentHeader as 'unstyle' | 'header-one' | 'header-two'} onChange={toggleBlockType} />
          </>
        )}
        <Divider flexItem orientation="vertical" sx={{ my: 1, mx: 0.5 }} />
        <ColorPicker value={currentColor} onChange={setInlineColor} />
        <LinkPicker
          editorState={editorState}
          linkModalOpen={linkModalOpen}
          setLinkModalOpen={setLinkModalOpen}
          value={currentLink}
          onChange={onEditorChange}
        />
        <EmojiPicker onChange={addEmoji} />
      </>
    </Paper>
  );

  return (
    <div
      ref={editorContainerRef}
      className={classnames('text-editor', { 'text-editor--with-border': withBorder })}
      style={{ borderColor: !error ? primaryColor : errorColor }}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
        if (editorRef.current) {
          event.preventDefault();
          editorRef.current.focus();
        }
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {inlineToolbar ? (
        <div style={{ marginBottom: '0.5rem' }}>{toolbar}</div>
      ) : (
        <div className="text-editor__toolbar-container">
          <div
            className={classnames('text-editor__toolbar', {
              'text-editor__toolbar--visible': hasFocus || linkModalOpen,
            })}
          >
            {toolbar}
          </div>
        </div>
      )}
      <div
        style={{
          position: 'relative',
          margin: withBorder ? '0.25rem' : 0,
          minHeight: withBorder ? '3rem' : 'unset',
          borderColor: !error ? primaryColor : errorColor,
        }}
      >
        {displayPlaceholder && <div style={{ position: 'absolute', color: fontDetailColor }}>{placeholder}</div>}
        <div
          onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
          }}
        >
          <Editor
            customStyleMap={getCustomStyleMap()}
            ref={editorRef}
            editorState={editorState}
            onChange={onEditorChange}
            handleKeyCommand={handleKeyCommand}
            handleBeforeInput={handleBeforeInput}
            handlePastedText={handlePastedText}
            blockStyleFn={blockStyleFn}
          />
        </div>
      </div>
    </div>
  );
};
