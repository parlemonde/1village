import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { TextField, Grid, ButtonBase } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { BackButton } from 'src/components/buttons/BackButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useImageStoryRequests } from 'src/services/useImagesStory';
import { bgPage, primaryColor, errorColor } from 'src/styles/variables.const';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { StoriesData, StoryElement } from 'types/story.type';

interface StoryProps {
  activityId: number;
}

const StoryStep1 = ({ activityId }: StoryProps) => {
  const router = useRouter();
  const { activity, updateActivity, createNewActivity, save } = React.useContext(ActivityContext);
  const { deleteStoryImage } = useImageStoryRequests(activityId);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const data = (activity?.data as StoriesData) || null;
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;

  // Create the story activity.
  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.STORY,
          undefined,
          {
            ...DEFAULT_STORY_DATA,
          },
          null,
          null,
          undefined,
        );
      } else if (activity && !isStory(activity)) {
        created.current = true;
        createNewActivity(
          ActivityType.STORY,
          undefined,
          {
            ...DEFAULT_STORY_DATA,
          },
          null,
          null,
          undefined,
        );
      }
    }
  }, [activity, createNewActivity, router.query]);

  const dataChange = (key: keyof StoryElement) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 400);
    const { object } = data;
    const newData = { ...data, object: { ...object, [key]: value } };
    updateActivity({ data: newData });
  };

  // Update the "object step" image url, when upload an image.
  const setImage = (imageUrl: string) => {
    const { object } = data;
    updateActivity({ data: { ...data, object: { ...object, imageUrl } } });
  };

  React.useEffect(() => {
    // if user navigated to the next step already, let's show the errors if there are any.
    if (window.sessionStorage.getItem(`story-step-1-next`) === 'true') {
      setIsError(true);
      window.sessionStorage.setItem(`story-step-1-next`, 'false');
    }
  }, []);

  const onNext = () => {
    save().catch(console.error);
    // save in local storage that the user is going to the next step.
    window.sessionStorage.setItem(`story-step-1-next`, 'true');
    router.push('/creer-une-histoire/2');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/creer-une-histoire" />}
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualisation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Inventez et dessinez un objet magique</h1>
          <p className="text">
            Cet objet, tout comme le lieu que vous choisirez à l’étape suivante, est magique ! Grâce à leurs pouvoirs, le village idéal a atteint
            l’objectif du développement durable que vous choisirez en étape 3.
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ width: '100%', marginTop: '1rem', position: 'relative' }}>
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
                        {data?.object?.imageUrl ? (
                          <Image layout="fill" objectFit="cover" alt="image de l'objet" src={data?.object?.imageUrl} unoptimized />
                        ) : (
                          <AddIcon style={{ fontSize: '80px' }} />
                        )}
                      </div>
                    </KeepRatio>
                  </ButtonBase>
                  {data?.object?.imageUrl && data.object.imageId && (
                    <div style={{ position: 'absolute', top: '0.25rem', right: '0.25rem' }}>
                      <DeleteButton
                        // onDelete={() => {
                        //   setImage('');
                        // }}
                        onDelete={() => {
                          console.log('delete');
                          deleteStoryImage(data.object.imageId);
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
                    imageUrl={data?.object?.imageUrl || ''}
                    setImageUrl={setImage}
                  />
                </div>
              </div>
              <TextField
                error={isError && data?.object?.description === ''}
                helperText={isError && data?.object?.description === '' && 'Écrivez la description de votre image !'}
                id="standard-multiline-static"
                label="Décrivez l’objet magique"
                value={data?.object?.description || ''}
                onChange={dataChange('description')}
                variant="outlined"
                multiline
                maxRows={4}
                style={{ width: '100%', marginTop: '25px', color: 'primary' }}
                inputProps={{
                  maxLength: 400,
                }}
              />
              {data?.object?.description ? (
                <div style={{ width: '100%', textAlign: 'right' }}>
                  <span className="text text--small">{data.object.description.length}/400</span>
                </div>
              ) : (
                <div style={{ width: '100%', textAlign: 'right' }}>
                  <span className="text text--small">0/400</span>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
        <StepsButton next={onNext} />
      </div>
    </Base>
  );
};
export default StoryStep1;
