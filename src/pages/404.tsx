import Link from 'next/link';
import React from 'react';

import Button from '@material-ui/core/Button';

import { KeepRatio } from 'src/components/KeepRatio';
import PelicoSearch from 'src/svg/pelico/pelico-search.svg';

const Custom404 = () => {
  return (
    <div className="bg-gradiant">
      <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
        <div className="text-center" style={{ overflow: 'auto' }}>
          <h1 className="text--primary" style={{ fontSize: '12vw', margin: 0, position: 'relative', display: 'inline-block' }}>
            404
            <div style={{ width: '15vw', position: 'absolute', top: '10%', left: '120%' }}>
              <PelicoSearch width="100%" height="100%" />
            </div>
          </h1>
          <h2>{"Oups ! Pelico n'a pas trouvé la page."}</h2>
          <p>La page que vous cherchez est introuvable ou temporairement inaccessible.</p>
          <Link href="/" passHref>
            <Button component="a" href="/" color="primary" variant="outlined" style={{ marginTop: '3rem' }}>
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </KeepRatio>
    </div>
  );
};

export default Custom404;
