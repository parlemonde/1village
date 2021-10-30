import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isFreeContent } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { Activities } from 'src/components/activities/List';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { errorColor } from 'src/styles/variables.const';
import { ActivityStatus } from 'types/activity.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorSteps, setErrorSteps] = React.useState([]);
  const [style, setStyle] = React.useState({});

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const isValid = (): boolean => {
    let result = true;
    activity?.content?.map((content: { value: string }) => {
      result = content.value === '' || content.value === '<p></p>\n' ? false : true;
    });

    return result;
  };

  React.useEffect(() => {
    if (!isValid()) {
      setErrorSteps([1]);
      setStyle({ border: `1px dashed ${errorColor}` });
    }

    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/contenu-libre');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/contenu-libre');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/contenu-libre/success');
    }
    setIsLoading(false);
  };

  return (
    activity && (
      <Base>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <Steps steps={['Contenu', 'Forme', 'Prévisualiser']} activeStep={2} errorSteps={errorSteps} />
          <div className="width-900">
            <h1>Pré-visualisez votre publication</h1>
            <p className="text" style={{ fontSize: '1.1rem' }}>
              Voici la pré-visualisation de votre publication.
              {isEdit
                ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
                : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
            </p>
            {isEdit ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                <Link href="/contenu-libre/2" passHref>
                  <Button component="a" color="secondary" variant="contained" onClick={() => router.push('/contenu-libre/2')}>
                    {"Modifier à l'étape précédente"}
                  </Button>
                </Link>
                <Button variant="outlined" color="primary" onClick={onPublish}>
                  Enregistrer les changements
                </Button>
              </div>
            ) : (
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                <Button variant="outlined" color="primary" onClick={onPublish} disabled={errorSteps.length > 0}>
                  Publier
                </Button>
              </div>
            )}

            {responseActivity !== null && (
              <>
                <span className={'text text--small text--success'}>Présentation en réaction au contenu libre</span>
                <div className="preview-block">
                  {!isEdit && (
                    <EditButton
                      onClick={() => {
                        router.push(`/contenu-libre/1?edit=${activity.id}`);
                      }}
                      status={'success'}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                    />
                  )}
                  <Activities activities={[responseActivity]} noButtons />
                </div>
              </>
            )}

            <span className={`text text--small ${errorSteps.length > 0 ? 'text--alert' : 'text--success'}`}>Contenu</span>
            <div className="preview-block" style={style}>
              <EditButton
                onClick={() => {
                  router.push('/contenu-libre/2');
                }}
                status={errorSteps.length > 0 ? 'error' : 'success'}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              />
              <ContentView content={activity.content} />
            </div>
            <ActivityCard activity={activity} user={user} />

            <StepsButton prev="/contenu-libre/2" />
          </div>
        </div>
        <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Base>
    )
  );
};

export default ContenuLibre;
