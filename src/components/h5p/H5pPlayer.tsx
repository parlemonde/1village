import { H5PPlayerUI } from '@lumieducation/h5p-react';
import * as React from 'react';

import { getH5pContentPlay } from 'src/api/h5p/h5p-content-play.get';

type H5pPlayerProps = {
  contentId?: string;
  contextId?: string;
};

const H5pPlayer = ({ contentId, contextId }: H5pPlayerProps) => {
  if (!contentId) {
    return null;
  }

  return (
    <H5PPlayerUI contentId={contentId} contextId={contextId} loadContentCallback={getH5pContentPlay} /* TODO onxAPIStatement={...} */></H5PPlayerUI>
  );
};

export default H5pPlayer;
