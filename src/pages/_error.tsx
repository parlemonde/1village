/* eslint-disable no-console */
import Link from 'next/link';
import type { NextPageContext } from 'next';
import React from 'react';

import { Button } from '@mui/material';

import { Base } from 'src/components/Base';

const ErrorPage = () => {
  return (
    <Base hideLeftNav showSubHeader={false}>
      <div className="text-center">
        <p>Une erreur inconnue dans la page test est survenue...</p>
        <Link href="/" passHref>
          <Button component="a" href="/" color="primary" variant="outlined" style={{ marginTop: '3rem' }}>
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    </Base>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  console.log('res', res);
  console.log('err', err);
  return { statusCode };
};

export default ErrorPage;
