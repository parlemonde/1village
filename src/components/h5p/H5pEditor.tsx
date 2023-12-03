import { H5PEditorUI } from '@lumieducation/h5p-react';
import * as React from 'react';

import { getH5pContent } from 'src/api/h5p/h5p-content.get';
import { patchH5pContent } from 'src/api/h5p/h5p-content.patch';
import { postH5pContent } from 'src/api/h5p/h5p-content.post';

const H5pEditor = () => {
  const [contentId, setContentId] = React.useState('new');
  const h5pEditorRef = React.useRef<H5PEditorUI | null>();

  return (
    <div>
      <H5PEditorUI
        ref={(ref) => {
          h5pEditorRef.current = ref;
        }}
        contentId={contentId}
        loadContentCallback={getH5pContent}
        saveContentCallback={(cId, body) => {
          if (!cId || cId === 'new' || cId === 'undefined') {
            return postH5pContent(body);
          } else {
            return patchH5pContent(cId, body);
          }
        }}
        onSaved={(cId) => {
          setContentId(cId);
        }}
        onSaveError={(error) => {
          console.error(error);
        }}
      />
      <button
        onClick={() => {
          h5pEditorRef.current?.save().catch();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default H5pEditor;
