import ContentEditable from 'react-contenteditable';
import React from 'react';

import type { Syllable } from 'src/activity-types/anthem.types';
import BacklineIcon from 'src/svg/anthem/backline.svg';
import TrashIcon from 'src/svg/anthem/trash.svg';

type SyllableEditorProps = {
  update?: (data: Syllable[]) => void;
  index: number;
  backline?: boolean;
  editable?: boolean;
  song?: boolean;
  data: Syllable[];
};

export const SyllableEditor: React.FC<SyllableEditorProps> = ({
  update = () => {},
  index,
  backline = false,
  editable = false,
  data,
  song = false,
}: React.PropsWithChildren<SyllableEditorProps>) => {
  const contentEditableRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;

  return (
    <>
      {backline && (
        <>
          <BacklineIcon height="1.45rem" style={{ marginTop: '25px' }} />
          <div
            style={{
              width: '100%',
            }}
          ></div>
        </>
      )}
      <div className={`syllable-editor${song ? '-song' : ''}`}>
        <ContentEditable
          innerRef={contentEditableRef}
          onChange={(e) => {
            data[index].value = e.target.value;
            update(data);
          }}
          onBlur={() => {
            if (data[index].value === '') data[index].value = 'LA';
            update(data);
          }}
          onFocus={() => {
            if (window.getSelection) {
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(contentEditableRef.current);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          }}
          disabled={!editable}
          tagName="span"
          html={data[index].value}
          style={{
            margin: '0 10px 0 5px',
            color: song ? '#666666' : '#4c3ed9',
            fontSize: song ? 'large' : 'smaller',
            borderBottom: song ? '1px solid #000' : 'none',
          }}
        />

        {!song && (
          <TrashIcon
            height="1.25rem"
            style={{
              verticalAlign: 'text-bottom',
            }}
            onClick={() => {
              data.splice(index, 1);
              update(data);
            }}
          />
        )}
      </div>
    </>
  );
};
