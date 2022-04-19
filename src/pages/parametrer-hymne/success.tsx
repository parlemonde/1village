import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageRequests } from 'src/services/useVillages';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const AnthemSuccess = () => {
  const { activity } = React.useContext(ActivityContext);
  const { village } = React.useContext(VillageContext);
  const { editVillage } = useVillageRequests();

  React.useEffect(() => {
    const updateVillage = async () => {
      if (village && activity && !village.anthemId) {
        await editVillage({ id: village.id, anthemId: activity.id });
        window.location.reload();
      }
    };

    updateVillage();
  }, [activity, village, editVillage]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text">Votre hymne a bien été paramétrée !</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        </div>
        <div className="text-center">
          <Link href="/" passHref>
            <Button component="a" href="/" variant="outlined" color="primary">
              Retour à l’accueil
            </Button>
          </Link>
        </div>
      </div>
    </Base>
  );
};

export default AnthemSuccess;
