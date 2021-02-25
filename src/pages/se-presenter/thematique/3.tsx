import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { SimpleActivityView } from 'src/components/activities';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';

const PresentationStep3: React.FC = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = activity?.data || null;
  const isEdit = activity !== null && activity.id !== 0;

  React.useEffect(() => {
    if ((data === null || !('theme' in data) || data.theme === -1) && !('activity-id' in router.query)) {
      router.push('/');
    }
  }, [data, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save();
    if (success) {
      router.push('/');
    }
    setIsLoading(false);
  };

  if (data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter/thematique/2" label={isEdit ? 'Modifier' : 'Retour'} />
        <Steps steps={['Choix du thème', 'Présentation', 'Prévisualisation']} activeStep={2} />
        <div className="width-900">
          <h1>Pré-visualisez votre présentation{!isEdit && ' et publiez la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre présentation.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/se-presenter/thematique/2">
                <Button component="a" color="secondary" variant="contained" href="/se-presenter/thematique/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Publier
              </Button>
            </div>
          )}
          <SimpleActivityView activity={activity} isPreview />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default PresentationStep3;
