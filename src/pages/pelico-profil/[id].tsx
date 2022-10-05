import { useRouter } from 'next/router';
import React from 'react';

import { Box } from '@mui/material';

import { Base } from 'src/components/Base';
import { RightNavigation } from 'src/components/accueil/RightNavigation';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { primaryColor } from 'src/styles/variables.const';
import { getQueryString } from 'src/utils';
import type { User } from 'types/user.type';

const PelicoProfil = () => {
  const router = useRouter();
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) ?? null, [router]);

  const { setSelectedPhase } = React.useContext(VillageContext);
  const { activity } = useActivity(activityId);
  const { users } = useVillageUsers();

  const usersMap = React.useMemo(() => {
    return users.reduce<{ [key: number]: User }>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);
  const activityUser = activity === null ? null : usersMap[activity.userId] ?? null;

  const activityPhase = activity ? activity.phase : -1;
  React.useEffect(() => {
    if (activityPhase !== -1) {
      setSelectedPhase(activityPhase);
    }
  }, [setSelectedPhase, activityPhase]);

  if (activity === null || activityUser === null) {
    return null;
  }

  return (
    <>
      <Base rightNav={<RightNavigation activityUser={activityUser} />}>
        <Box
          sx={{
            marginLeft: '2%',
            marginRight: '2%',
          }}
        >
          <h1 style={{ marginTop: '0.5rem', color: primaryColor }}>La page profil de Pélico</h1>
          <div style={{ display: 'inline-block', textAlign: 'justify' }}>
            <p className="text">
              Bonjour les Pélicopains,
              <br />
              <br />
              Je suis Pélico, un toucan qui adore voyager ! Cette année, nous allons échanger tous ensemble sur 1Village. Avec Cécile, ma grande amie,
              nous serons là toute l’année pour vous guider dans ce voyage.
              <br />
              <br />
              Vous vous demandez certainement pourquoi je m’appelle Pélico… alors que je ne suis pas un pélican ?
              <br />
              <br />
              Mon nom vient du mot espagnol “perico”, qui est une espèce de perroquet d’Amérique du Sud. Lorsque l’on voyage et que l’on tente
              d’apprendre une langue comme moi, on peut vite se transformer en perroquet qui répète tout ce qu’il entend. Des amis m’ont donc nommé
              ainsi au cours de l’un de mes voyages en Amérique du Sud.. Et comme le R de “perico” se prononce comme un L, voilà pourquoi on m’appelle
              ainsi !
              <br />
              <br />
              Vous voyez, en se questionnant, on découvre de drôles d’anecdotes.
              <br />
              <br />
              Adoptez la même posture avec vos amis, vos correspondants, votre famille et vous verrez que vous apprendrez plein de choses sur le monde
              qui vous entoure !
            </p>
          </div>
        </Box>
      </Base>
    </>
  );
};

export default PelicoProfil;
