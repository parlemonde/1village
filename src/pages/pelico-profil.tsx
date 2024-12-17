import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { usePelicoPresentation } from 'src/api/pelicoPresentation/pelicoPresentation.get';
import { Base } from 'src/components/Base';
import { PelicoProfilNavigation } from 'src/components/accueil/PelicoProfilNavigation';
import { ContentView } from 'src/components/activities/content/ContentView';
import { UserContext } from 'src/contexts/userContext';
import { primaryColor } from 'src/styles/variables.const';
import type { PelicoPresentation } from 'types/pelicoPresentation.type';

const PelicoProfil = () => {
  const { user } = React.useContext(UserContext);
  const [presentation, setPresentation] = useState<PelicoPresentation>({ content: [], id: 1 });
  const {
    data: presentationData,
    isLoading: presentationLoading,
    isError: presentationError,
    isSuccess: presentationSuccess,
  } = usePelicoPresentation(1); // Récupère la présentation avec l'id 1

  useEffect(() => {
    if (presentationSuccess) {
      if (presentationData !== null) {
        setPresentation(presentationData);
      }
    }
  }, [presentationSuccess, presentationData]);

  if (presentationLoading) {
    return <div>Loading...</div>;
  }
  if (presentationError) {
    return <p>Error!</p>;
  }

  return (
    <>
      {user && (
        <Base rightNav={<PelicoProfilNavigation />} hideLeftNav>
          <Box
            sx={{
              marginLeft: '2%',
              marginRight: '2%',
            }}
          >
            <h1 style={{ marginTop: '0.5rem', color: primaryColor }}>Pélico, la mascotte d&apos;1Village, se présente</h1>
            <ContentView content={presentation.content} activityId={presentation.id} />
          </Box>
        </Base>
      )}
    </>
  );
};

export default PelicoProfil;
