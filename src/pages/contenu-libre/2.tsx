import { useRouter } from 'next/router';
import React from 'react';

import { TextField, withStyles } from '@material-ui/core';

import { isFreeContent } from 'src/activity-types/anyActivity';
import type { FreeContentData } from 'src/activity-types/freeContent.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityContext } from 'src/contexts/activityContext';

const StyledTextField = withStyles({
  root: {
    '& fieldset': {
      borderWidth: '1px!important',
    },
  },
})(TextField);

const ContenuLibre = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, save } = React.useContext(ActivityContext);

  const data = (activity?.data as FreeContentData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/contenu-libre/1');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/contenu-libre/1');
    }
  }, [activity, router]);

  const dataChange = (key: keyof FreeContentData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 400);
    const newData = { ...data, [key]: value };
    updateActivity({ data: newData });
    console.log(activity);
  };

  // const prevImage = React.useRef<string | null>(data?.mascotteImage || null);
  // React.useEffect(() => {
  //   if (data !== null && data.mascotteImage !== prevImage.current) {
  //     prevImage.current = data.mascotteImage;
  //     save().catch();
  //   }
  // }, [data, save]);

  const isValid = (): boolean => {
    if (data.title === '') return false;
    if (data.resume === '') return false;
    return true;
  };

  const onNext = () => {
    save().catch(console.error);
    if (!isValid()) {
      setIsError(true);
    } else {
      router.push('/contenu-libre/3');
    }
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Contenu', 'Forme', 'Pré-visualiser']} activeStep={1} />
        <div className="width-900">
          <h1>Ajustez l&apos;apparence de votre publication</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Vous pouvez ajuster le titre, l&apos;extrait et l&apos;image à la une de votre publication qui sera intégrée sur le fil d&apos;actualité.
            Vous pouvez également décider de mettre votre publication à l&apos;avant, tout en haut du fil d&apos;actualité.
          </p>
          <TextField
            error={isError && data.title === ''}
            helperText={isError && data.title === '' && 'Écrivez le titre de votre publication !'}
            value={data.title}
            onChange={dataChange('title')}
            label="Titre de votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1vw' }}
          />
          <TextField
            error={isError && data.resume === ''}
            helperText={isError && data.resume === '' && "Écrivez l'extrait de votre publication !"}
            value={data.resume}
            onChange={dataChange('resume')}
            label="Extrait votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1vw' }}
          />
          <StepsButton prev="/contenu-libre/1" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
