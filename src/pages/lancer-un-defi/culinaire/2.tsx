import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { ButtonBase, Grid, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { isDefi } from 'src/activity-types/anyActivity';
import { isCooking } from 'src/activity-types/defi.const';
import { CookingDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { bgPage } from 'src/styles/variables.const';
import { ActivityStatus } from 'types/activity.type';

const DefiStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [imageUrl, setIsImageUrl] = React.useState('');
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const data = (activity?.data as CookingDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isCooking(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isCooking(activity))) {
    return <div></div>;
  }

  const dataChange = (key: 'name' | 'history' | 'explanation') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 600);
    const newData: CookingDefiData = { ...data, [key]: value };
    updateActivity({ data: newData });
  };

  const setImage = (image: string) => {
    const newData: CookingDefiData = { ...data, image };
    updateActivity({ data: newData });
  };

  const isValid = (): boolean => {
    if (data.name === '') return false;
    if (data.history === '') return false;
    if (data.explanation === '') return false;
    return true;
  };

  const onNext = () => {
    save().catch(console.error);
    if (!isValid()) {
      setIsError(true);
    } else {
      router.push('/lancer-un-defi/culinaire/3');
    }
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Votre plat', 'La recette', 'Le défi', 'Prévisualisation'])} activeStep={isEdit ? 0 : 1} />
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
                    value={data.image}
                    onChange={setImage}
                    onDelete={() => {}}
                    isModalOpen={isImageModalOpen}
                    setIsModalOpen={setIsImageModalOpen}
                    imageUrl={imageUrl}
                    setImageUrl={setIsImageUrl}
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
          {<StepsButton prev={isEdit ? undefined : `/lancer-un-defi/culinaire/1?edit=${activity.id}`} next={onNext} />}
        </div>
      </div>
    </Base>
  );
};

export default DefiStep2;
