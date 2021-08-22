import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { bgPage } from 'src/styles/variables.const';

interface H5pProps {
  src: string;
}

export const H5p = ({ src }: H5pProps) => {
  const [loading, setIsLoading] = React.useState(true);

  // On src change, set new loading
  React.useEffect(() => {
    setIsLoading(true);
  }, [src]);

  if (!src) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}>
      <iframe
        src={src}
        frameBorder="0"
        allowFullScreen={true}
        allow="encrypted-media *"
        onLoad={() => {
          setIsLoading(false);
        }}
        style={{ width: '100%', height: '100px', borderBottom: '1px solid rgb(238, 238, 238)' }}
      ></iframe>
      {loading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute',
            backgroundColor: bgPage,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </div>
      )}
    </div>
  );
};
