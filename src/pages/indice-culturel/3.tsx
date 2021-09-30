import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { isIndice } from 'src/activity-types/anyActivity';
import { INDICE_TYPES } from 'src/activity-types/indice.constants';
import type { IndiceData } from 'src/activity-types/indice.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { Activities } from 'src/components/activities/List';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useActivity } from 'src/services/useActivity';
import { ActivityStatus } from 'types/activity.type';
import { errorColor } from 'src/styles/variables.const';

const IndiceStep3 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorSteps, setErrorSteps] = React.useState([]);
  const [style, setStyle] = React.useState({});

  const data = (activity?.data as IndiceData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
 const isValid = () => {
   let result = true;
  activity?.processedContent?.map((content) => {
    result = content.value === "" || content.value === "<p></p>\n" ? false : true
  })

  return result;
 }
  React.useEffect(() => {
    if (!isValid()) {
      setErrorSteps([1]);
      setStyle({ border: `1px dashed ${errorColor}` });
    }

    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/indice-culturel');
    } else if (activity && !isIndice(activity)) {
      router.push('/indice-culturel');
    }
  }, [activity, router]);

  const onPublish = async () => {
    if (!isValid()) {
      return;
    }
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/indice-culturel/success');
    }
    setIsLoading(false);
  };

  if (data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={[INDICE_TYPES[activity.subType].step1 ?? 'Indice', "Créer l'indice", 'Prévisualiser']} activeStep={2} errorSteps={errorSteps} />
        <div className="width-900">
          <h1>Pré-visualisez votre publication{!isEdit && ' et publiez-la.'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre publication.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/indice-culturel/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/se-presenter/thematique/3">
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

          {responseActivity !== null && (
            <>
              <span className={'text text--small text--success'}>Présentation en réaction à l&apos;indice culturel</span>
              <div className="preview-block" >
                {!isEdit && (
                  <EditButton
                    onClick={() => {
                      router.push(`/indice-culturel/1?edit=${activity.id}`);
                    }}
                    status={'success'}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  />
                )}
                <Activities activities={[responseActivity]} noButtons />
              </div>
            </>
          )}

          <span className={'text text--small text--success'}>Thème</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/indice-culturel');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p style={{ margin: '0.5rem 0' }}>{INDICE_TYPES[activity.subType].title}</p>
          </div>

          <span className={`text text--small ${errorSteps.length > 0 ? 'text--alert' : 'text--success'}`}>Indice culturel</span>
          <div className="preview-block" style={style}>
            <EditButton
              onClick={() => {
                router.push('/indice-culturel/2');
              }}
              status={errorSteps.length > 0 ? 'error' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.processedContent} />
          </div>

          <StepsButton prev="/indice-culturel/2" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base >
  );
};

export default IndiceStep3;
