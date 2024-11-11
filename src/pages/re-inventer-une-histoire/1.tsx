import AddIcon from '@mui/icons-material/Add';
import { Grid, ButtonBase, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { isStory } from 'src/activity-types/anyActivity';
import { ODD_CHOICE } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { BackButton } from 'src/components/buttons/BackButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { bgPage, primaryColor, errorColor } from 'src/styles/variables.const';
import { ActivityStatus } from 'types/activity.type';
import type { StoriesData } from 'types/story.type';

const ReInventStoryStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [oDDChoice, setODDChoice] = React.useState('');
  const data = (activity?.data as StoriesData) || null;
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/re-inventer-une-histoire');
    } else if (activity && !isStory(activity)) {
      router.push('/re-inventer-une-histoire');
    }
  }, [activity, router]);

  // Update the "odd step" image url, when upload an image.
  const setImage = (imageUrl: string) => {
    const { odd } = data;
    updateActivity({ data: { ...data, odd: { ...odd, imageId: 0, imageUrl, inspiredStoryId: 0 } } });
  };
  React.useEffect(() => {
    // if user navigated to the next step already, let's show the errors if there are any.
    if (window.sessionStorage.getItem(`re-invent-a-story-step-1-next`) === 'true') {
      setIsError(true);
      window.sessionStorage.setItem(`re-invent-a-story-step-1-next`, 'false');
    }
  }, []);
  const onNext = () => {
    save().catch(console.error);
    // save in local storage that the user is going to the next step.
    window.sessionStorage.setItem(`re-invent-a-story-step-1-next`, 'true');
    router.push('/re-inventer-une-histoire/2');
  };

  if (data === null || activity === null || !isStory(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <PageLayout>
        {!isEdit && <BackButton href="/re-inventer-une-histoire" />}
        <Steps
          steps={['ODD', 'Objet', 'Lieu', 'Histoire', 'Prévisualisation']}
          urls={[
            '/re-inventer-une-histoire/1?edit',
            '/re-inventer-une-histoire/2',
            '/re-inventer-une-histoire/3',
            '/re-inventer-une-histoire/4',
            '/re-inventer-une-histoire/5',
          ]}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Choisissez et dessinez l’objectif du développement durable à atteindre</h1>
          <p className="text">Pour atteindre votre objectif de développement durable, vous choisirez un objet et un lieu aux étapes précédentes.</p>
          <p className="text">Choisissez votre objectif et dessinez-le.</p>
          <Grid container>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ width: '100%', maxWidth: '320px', marginTop: '1rem', position: 'relative' }}>
                  <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%', color: `${isError ? errorColor : primaryColor}` }}>
                    <KeepRatio ratio={2 / 3} width="100%">
                      <div
                        style={{
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${isError ? errorColor : primaryColor}`,
                          borderRadius: '10px',
                          justifyContent: 'center',
                        }}
                      >
                        {data?.odd?.imageUrl ? (
                          <Image
                            layout="fill"
                            objectFit="cover"
                            alt="image de l'objectif de développement durable"
                            src={data?.odd?.imageUrl}
                            unoptimized
                          />
                        ) : (
                          <AddIcon style={{ fontSize: '80px' }} />
                        )}
                      </div>
                    </KeepRatio>
                  </ButtonBase>
                  {data?.odd?.imageUrl && (
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
                    imageUrl={data?.odd?.imageUrl || ''}
                    setImageUrl={setImage}
                  />
                </div>
                <FormControl variant="outlined" className="full-width" style={{ marginTop: '1rem' }}>
                  <InputLabel id="select-ODD">ODD</InputLabel>
                  <Select
                    error={isError && data?.odd?.description === ''}
                    labelId="select-ODD"
                    id="select-ODD-outlined"
                    value={oDDChoice || data?.odd?.description}
                    onChange={(event) => {
                      setODDChoice(event.target.value as string);
                      const { odd } = data;
                      updateActivity({ data: { ...data, odd: { ...odd, description: event.target.value } } });
                    }}
                    label="Village"
                  >
                    {(ODD_CHOICE || []).map((v, index) => (
                      <MenuItem value={v.choice} key={index + 1}>
                        {v.choice}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Choisissez votre ODD </FormHelperText>
                </FormControl>
              </div>
            </Grid>
          </Grid>
        </div>
        <StepsButton next={onNext} />
      </PageLayout>
    </Base>
  );
};

export default ReInventStoryStep1;
