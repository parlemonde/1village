import type { NextPageContext } from 'next';
import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { Base } from 'src/components/Base';

const ErrorPage = () => {
  return (
    <Base hideLeftNav showSubHeader={false}>
      <div className="text-center">
        <p>Une erreur inconnue est survenue...</p>
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
  return { statusCode };
};

export default ErrorPage;
