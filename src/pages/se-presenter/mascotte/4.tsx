import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep4: React.FC = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0;

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save();
    if (success) {
      router.push('/');
    }
    setIsLoading(false);
  };

  if (!activity) router.push('/se-presenter/mascotte/1');

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter/mascotte/3" label={isEdit ? 'Modifier' : 'Retour'} />
        <Steps
          steps={[
            'Votre classe',
            'Votre mascotte : ' + activity.data.mascotteName ?? 'mascotteName',
            'Description de votre mascotte',
            'Prévisualiser',
          ]}
          activeStep={3}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre mascotte{!isEdit && ' et publiez la'}</h1>
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
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/1');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <span>Nous sommes </span>
            {activity.data.totalStudent}
            <span> élèves, dont </span>
            {activity.data.girlStudent}
            <span> filles et </span>
            {activity.data.boyStudent}
            <span> garçons.</span>
            <br />
            <span>En moyenne, l’âge des élèves de notre classe est </span>
            {activity.data.meanAge}
            <span> ans.</span>
            <br />
            <span>Nous avons </span>
            {activity.data.totalTeacher}
            <span> professeurs, dont </span>
            {activity.data.womanTeacher}
            <span> femmes et </span>
            {activity.data.manTeacher}
            <span> hommes.</span> <br />
            <span>Dans notre école, il y a </span>
            {activity.data.numberClassroom}
            <span> classes et </span>
            {activity.data.totalSchoolStudent}
            <span> élèves.</span>
          </div>
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default MascotteStep4;
