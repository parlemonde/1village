import Link from 'next/link';
import React from 'react';

import Button from '@material-ui/core/Button';

import { KeepRatio } from 'src/components/KeepRatio';
import Logo from 'src/svg/logo.svg';

export const VideoPresentation: React.FC = () => {
  return (
    <div className="bg-gradiant">
      <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
        <div className="text-center" style={{ overflow: 'auto' }}>
          <div className="flex-center" style={{ margin: '0.8rem 0', justifyContent: 'center' }}>
            <Logo style={{ width: '40px', height: 'auto' }} />
            <h1 className="title" style={{ margin: '0 0 0 0.5rem' }}>
              1Village
            </h1>
          </div>
          <iframe
            src="https://player.vimeo.com/video/486754984?byline=0"
            width="640"
            height="360"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ height: '65%', width: '100%' }}
          ></iframe>
          <Link href="/login" prefetch>
            <Button component="a" href="/login" color="primary" variant="outlined" style={{ marginTop: '0.8rem' }}>
              Se connecter
            </Button>
          </Link>
        </div>
      </KeepRatio>
    </div>
  );
};
