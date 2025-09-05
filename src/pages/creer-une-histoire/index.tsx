import Link from 'next/link';
import React from 'react';

import { Box, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';

const Story = () => {
  return (
    <Base>
      <PageLayout>
        <p className="text">
          Pour inventer une histoire, vous allez devoir imaginer votre village-monde idéal et le présenter aux pélicopains à travers des textes et des
          images. Pour cela, plusieurs étapes vous attendent…
        </p>
        <p className="text">Vous êtes prêts ? 1, 2, 3 fermez les yeux et laissez libre court à votre imagination !</p>
      </PageLayout>
      <Box sx={{ display: 'flex', justifyContent: 'end', pr: '1rem', mb: '1rem' }}>
        <Link href="/creer-une-histoire/1" passHref>
          <Button component="a" href="/creer-une-histoire/1" variant="outlined" color="primary">
            Commencer
          </Button>
        </Link>
      </Box>
    </Base>
  );
};

export default Story;
