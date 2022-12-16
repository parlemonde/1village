import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { ActivityContext } from 'src/contexts/activityContext';
import { useGameRequests } from 'src/services/useGames';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { GameType } from 'types/game.type';

const PresentationSuccess = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);
  const { getAvailableGamesCount } = useGameRequests();
  const [hasMimicsAvailable, setHasMimicsAvailable] = React.useState<boolean>(false);

  if (!activity || !isGame(activity)) {
    router.push('/creer-un-jeu/mimique');
  }

  React.useEffect(() => {
    getAvailableGamesCount(GameType.MIMIC).then((count) => {
      setHasMimicsAvailable(count > 0);
    });
  }, [getAvailableGamesCount]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text">{'Vos mimiques ont bien été publiées !'}</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
          {hasMimicsAvailable ? (
            <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}>
              <Link href="/" passHref>
                {"Revenir à l'accueil"}
              </Link>
            </p>
          ) : (
            <p className="text">{''}</p>
          )}
        </div>
        <div className="text-center">
          {hasMimicsAvailable ? (
            <Link href="/creer-un-jeu/mimique/jouer" passHref>
              <Button component="a" href="/creer-un-jeu/mimique/jouer" variant="outlined" color="primary">
                Découvrir les mimiques de vos Pélicopains !
              </Button>
            </Link>
          ) : (
            <Link href="/" passHref>
              <Button component="a" href="/" variant="outlined" color="primary">
                Revenir à l&apos;accueil
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Base>
  );
};

export default PresentationSuccess;
