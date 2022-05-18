import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Grid, ButtonBase, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { ODD_CHOICE } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { getErrorSteps } from 'src/components/activities/storyChecks';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useImageStoryRequests } from 'src/services/useImagesStory';
import { primaryColor, bgPage } from 'src/styles/variables.const';
import type { StoriesData } from 'types/story.type';

const StoryStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const { deleteStoryImage } = useImageStoryRequests();
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [oDDChoice, setODDChoice] = React.useState('');
  const data = (activity?.data as StoriesData) || null;

  const errorSteps = React.useMemo(() => {
    const errors = [];
    if (data !== null) {
      if (getErrorSteps(data.object, 1).length > 0) {
        errors.push(0);
      }
      if (getErrorSteps(data.place, 2).length > 0) {
        errors.push(1);
      }
      return errors;
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-histoire');
    } else if (activity && !isStory(activity)) {
      router.push('/creer-une-histoire');
    }
  }, [activity, router]);

  // Update the "object step" image url, when upload an image.
  const setImage = (imageUrl: string) => {
    const { odd } = data;
    updateActivity({ data: { ...data, odd: { ...odd, inspiredStoryId: activity?.id, imageUrl, imageId: 0 } } });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/creer-une-histoire/4');
  };

  if (data === null || activity === null || !isStory(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualisation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Choisissez et dessinez l’objectif du développement durable atteint</h1>
          <p className="text">
            Grâce aux pouvoirs magiques de l’objet et du lieu choisis aux étapes précédentes, un des objectifs du développement durable a été atteint.
          </p>
          <p className="text">Choisissez lequel et dessinez-le.</p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ width: '100%', marginTop: '1rem', position: 'relative' }}>
                  <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%', color: `${primaryColor}` }}>
                    <KeepRatio ratio={2 / 3} width="100%">
                      <div
                        style={{
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${primaryColor}`,
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
                          deleteStoryImage(data.odd.imageId, data, 3);
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
        <StepsButton prev="/creer-une-histoire/2" next={onNext} />
      </div>
    </Base>
  );
};

export default StoryStep3;
