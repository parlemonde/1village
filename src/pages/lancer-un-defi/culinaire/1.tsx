import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { ButtonBase, Grid, TextField } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { DEFI, isCooking } from 'src/activity-types/defi.constants';
import type { CookingDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { BackButton } from 'src/components/buttons/BackButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { bgPage } from 'src/styles/variables.const';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const DefiStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity, save } = React.useContext(ActivityContext);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as CookingDefiData) || null;

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, DEFI.COOKING, {
          name: '',
          history: '',
          explanation: '',
          defiIndex: null,
        });
      } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isCooking(activity)))) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, DEFI.COOKING, {
          name: '',
          history: '',
          explanation: '',
          defiIndex: null,
        });
      }
    }
  }, [activity, createNewActivity, router]);

  const dataChange = (key: 'name' | 'history' | 'explanation') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 600);
    const newData: CookingDefiData = { ...data, [key]: value };
    updateActivity({ data: newData });
  };

  const setImage = (image: string) => {
    const newData: CookingDefiData = { ...data, image };
    updateActivity({ data: newData });
  };

  React.useEffect(() => {
    // if user navigated to the next step already, let's show the errors if there are any.
    if (window.sessionStorage.getItem(`defi-cooking-step-1-next`) === 'true') {
      setIsError(true);
      window.sessionStorage.setItem(`defi-cooking-step-1-next`, 'false');
    }
  }, []);

  const onNext = () => {
    save().catch(console.error);
    // save in local storage that the user is going to the next step.
    window.sessionStorage.setItem(`defi-cooking-step-1-next`, 'true');
    router.push('/lancer-un-defi/culinaire/2');
  };

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isCooking(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/lancer-un-defi" />}
        <Steps
          steps={['Votre plat', 'La recette', 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/culinaire/1?edit', '/lancer-un-defi/culinaire/2', '/lancer-un-defi/culinaire/3', '/lancer-un-defi/culinaire/4']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Quel est le plat que vous avez choisi ?</h1>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <div style={{ width: '100%', marginTop: '1rem', position: 'relative' }}>
                  <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%' }}>
                    <KeepRatio ratio={2 / 3} width="100%">
                      <div
                        style={{
                          backgroundColor: bgPage,
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {data.image ? (
                          <Image layout="fill" objectFit="contain" alt="image du plat" src={data.image} unoptimized />
                        ) : (
                          <AddIcon style={{ fontSize: '80px' }} />
                        )}
                      </div>
                    </KeepRatio>
                  </ButtonBase>
                  {data.image && (
                    <div style={{ position: 'absolute', top: '0.25rem', right: '0.25rem' }}>
                      <DeleteButton
                        onDelete={() => {
                          setImage('');
                        }}
                        confirmLabel="Êtes-vous sur de vouloir supprimer l'image ?"
                        confirmTitle="Supprimer l'image"
                        style={{ backgroundColor: bgPage }}
                      />
                    </div>
                  )}
                  <ImageModal
                    id={0}
                    isModalOpen={isImageModalOpen}
                    setIsModalOpen={setIsImageModalOpen}
                    imageUrl={data.image || ''}
                    setImageUrl={setImage}
                  />
                </div>
                <p className="text-center" style={{ marginTop: '10px' }}>
                  Image de votre plat
                </p>
              </Grid>
              <Grid item xs={12} md={8}>
                <p>Quel est le nom du plat ?</p>
                <TextField
                  error={isError && data.name === ''}
                  helperText={isError && data.name === '' && 'Écrivez le nom de votre plat !'}
                  value={data.name}
                  onChange={dataChange('name')}
                  label="Nom"
                  variant="outlined"
                  placeholder="Nom du plat"
                  style={{ width: '50%', minWidth: '14rem', maxWidth: '100%', marginBottom: isError && data.name === '' ? '0' : '0.75rem' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <p>Quel est l’histoire de ce plat ? D’où vient-il ?</p>
                <TextField
                  error={isError && data.history === ''}
                  helperText={isError && data.history === '' && "Écrivez l'histoire de votre plat !"}
                  value={data.history}
                  onChange={dataChange('history')}
                  label="Histoire"
                  multiline
                  variant="outlined"
                  placeholder="Histoire de votre plat..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: '100%' }}
                />
                {!(isError && data.history === '') && (
                  <div style={{ width: '100%', textAlign: 'right' }}>
                    <span className="text text--small">{data.history.length}/600</span>
                  </div>
                )}
                <p>Pourquoi avoir choisi ce plat ?</p>
                <TextField
                  error={isError && data.explanation === ''}
                  helperText={isError && data.explanation === '' && 'Écrivez pourquoi vous avez choisi ce plat !'}
                  value={data.explanation}
                  onChange={dataChange('explanation')}
                  label="Choix du plat"
                  multiline
                  variant="outlined"
                  placeholder=""
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: '100%' }}
                />
                {!(isError && data.explanation === '') && (
                  <div style={{ width: '100%', textAlign: 'right' }}>
                    <span className="text text--small">{data.explanation.length}/600</span>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
          {<StepsButton next={onNext} />}
        </div>
      </div>
    </Base>
  );
};

export default DefiStep1;
