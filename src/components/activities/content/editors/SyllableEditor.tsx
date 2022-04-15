import ContentEditable from 'react-contenteditable';
import React from 'react';

import type { Syllable } from 'src/activity-types/anthem.types';
import BacklineIcon from 'src/svg/anthem/backline.svg';
import TrashIcon from 'src/svg/anthem/trash.svg';

type SyllableEditorProps = {
  update: (data: Syllable[]) => void;
  index: number;
  backline?: boolean;
  editable?: boolean;
  song?: boolean;
  data: Syllable[];
};

export const SyllableEditor: React.FC<SyllableEditorProps> = ({
  update,
  index,
  backline = false,
  editable = false,
  data,
  song = false,
}: React.PropsWithChildren<SyllableEditorProps>) => (
  <>
    <div className={`syllable-editor${song ? '-song' : ''}`}>
      <ContentEditable
        onChange={(e) => {
          data[index].value = e.target.value;
          update(data);
        }}
        disabled={!editable}
        tagName="span"
        html={data[index].value ? data[index].value : 'LA'}
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
  </>
);
