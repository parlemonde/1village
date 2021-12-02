import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@mui/material/Button';

import { isGame } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { serializeToQueryUrl } from 'src/utils';
import { GameType } from 'types/game.type';

const PresentationSuccess = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);
  const { village } = React.useContext(VillageContext);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [firstCreation, setFirstCreation] = React.useState<boolean>(false);

  if (!activity || !isGame(activity)) {
    router.push('/creer-un-jeu/mimique');
  }

  React.useEffect(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/games/play${serializeToQueryUrl({
          villageId: village.id,
          type: GameType.MIMIC,
        })}`,
      }).then((response) => {
        if (!response.error && response.data !== null) {
          setFirstCreation(response.data as boolean);
        } else {
          setFirstCreation(true);
        }
      });
    }
  }, [axiosLoggedRequest, village]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text">{'Vos mimiques ont bien été publiées !'}</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
          {firstCreation === true ? (
            <p className="text">{''}</p>
          ) : (
            <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}>
              <Link href="/" passHref>
                {"Revenir à l'accueil"}
              </Link>
            </p>
          )}
        </div>
        <div className="text-center">
          {firstCreation === true ? (
            <Link href="/" passHref>
              <Button component="a" href="/" variant="outlined" color="primary">
                Revenir à l&apos;accueil
              </Button>
            </Link>
          ) : (
            <Link href="/creer-un-jeu/mimique" passHref>
              <Button component="a" href="/creer-un-jeu/mimique" variant="outlined" color="primary">
                Découvrir les mimiques de vos Pélicopains !
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Base>
  );
};

export default PresentationSuccess;
