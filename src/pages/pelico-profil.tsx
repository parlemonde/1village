import React from 'react';

import { Box } from '@mui/material';

import { Base } from 'src/components/Base';
import { PelicoProfilNavigation } from 'src/components/accueil/PelicoProfilNavigation';
import { UserContext } from 'src/contexts/userContext';
import { primaryColor } from 'src/styles/variables.const';

//
const PelicoProfil = () => {
  const { user } = React.useContext(UserContext);

  return (
    <>
      {user && (
        <Base rightNav={<PelicoProfilNavigation />}>
          <Box
            sx={{
              marginLeft: '2%',
              marginRight: '2%',
            }}
          >
            <h1 style={{ marginTop: '0.5rem', color: primaryColor }}>Pelico, la mascotte d&apos;1Village, se présente</h1>
            <div style={{ display: 'inline-block', textAlign: 'justify' }}>
              <p className="text">
                Bonjour les Pélicopains,
                <br />
                <br />
                Je suis Pélico, un toucan qui adore voyager ! Cette année, nous allons échanger tous ensemble sur 1Village. Avec Cécile, ma grande
                amie, nous serons là toute l’année pour vous guider dans ce voyage.
                <br />
                <br />
                Vous vous demandez certainement pourquoi je m’appelle Pélico… alors que je ne suis pas un pélican ?
                <br />
                <br />
                Mon nom vient du mot espagnol “perico”, qui est une espèce de perroquet d’Amérique du Sud. Lorsque l’on voyage et que l’on tente
                d’apprendre une langue comme moi, on peut vite se transformer en perroquet qui répète tout ce qu’il entend. Des amis m’ont donc nommé
                ainsi au cours de l’un de mes voyages en Amérique du Sud.. Et comme le R de “perico” se prononce comme un L, voilà pourquoi on
                m’appelle ainsi !
                <br />
                <br />
                Vous voyez, en se questionnant, on découvre de drôles d’anecdotes.
                <br />
                <br />
                Adoptez la même posture avec vos amis, vos correspondants, votre famille et vous verrez que vous apprendrez plein de choses sur le
                monde qui vous entoure !
              </p>
            </div>
          </Box>
        </Base>
      )}
    </>
  );
};

export default PelicoProfil;
