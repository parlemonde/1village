import { H5PEditorUI } from '@lumieducation/h5p-react';
import { Button } from '@mui/material';
import * as React from 'react';

import { getH5pContent } from 'src/api/h5p/h5p-content.get';
import { patchH5pContent } from 'src/api/h5p/h5p-content.patch';
import { postH5pContent } from 'src/api/h5p/h5p-content.post';

type H5pEditorProps = {
  contentId?: string;
  onSave?: (newContentId: string) => void;
  onError?: (message: string) => void;
};

const H5pEditor = ({ contentId = 'new', onSave, onError }: H5pEditorProps) => {
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
          onSave?.(cId);
        }}
        onSaveError={(error) => {
          onError?.(error);
        }}
      />
      <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            h5pEditorRef.current?.save().catch();
          }}
        >
          {contentId === 'new' ? 'Créer le contenu H5P !' : 'Mettre à jour le contenu H5P !'}
        </Button>
      </div>
    </div>
  );
};

export default H5pEditor;
