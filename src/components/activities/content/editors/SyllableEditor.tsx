import ContentEditable from 'react-contenteditable';
import React from 'react';

import type { AnthemData } from 'src/activity-types/anthem.types';
import BacklineIcon from 'src/svg/anthem/backline.svg';
import TrashIcon from 'src/svg/anthem/trash.svg';
import type { Activity } from 'types/activity.type';

type SyllableEditorProps = {
  update: (activity: Partial<Activity>) => void;
  index: number;
  backline?: boolean;
  editable?: boolean;
  data: AnthemData;
};

export const SyllableEditor: React.FC<SyllableEditorProps> = ({
  update,
  index,
  backline = false,
  editable = false,
  data,
}: React.PropsWithChildren<SyllableEditorProps>) => {
  const part = editable ? 'chorus' : 'verse';

  return (
    <>
      <div
        className="syllable-editor"
        style={{ width: 'fit-content', padding: '1px', maxWidth: '50vh', display: 'inline-block', marginRight: '10px' }}
      >
        <ContentEditable
          onChange={(e) => {
            data[part][index].value = e.target.value;
            update({ data: { ...data, [part]: data[part] } });
          }}
          disabled={!editable}
          tagName="span"
          html={data[part][index].value}
          style={{ margin: '0 10px 0 5px', color: '#4c3ed9', fontSize: 'smaller' }}
        />

        <TrashIcon
          height="1.25rem"
          style={{
            verticalAlign: 'text-bottom',
          }}
          onClick={() => {
            data[part].splice(index, 1);
            update({ data: { ...data, [part]: data[part] } });
          }}
        />
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
};
