import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { TextField, Grid, Button, ButtonBase } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { bgPage } from 'src/styles/variables.const';
import UploadIcon from 'src/svg/jeu/add-video.svg';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { StoriesData, StoryElement } from 'types/story.type';

const StoryStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, createNewActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const data = (activity?.data as StoriesData) || null;
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  console.log('data', data);

  // Here we create the story activity.
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
            imageStory: '',
            tale: '',
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
            imageStory: '',
            tale: '',
          },
          null,
          null,
          undefined,
        );
      }
    }
  }, [activity, createNewActivity, router.query, user, village]);

  const dataChange = (key: keyof StoryElement) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 400);
    const newData: StoriesData = { ...data, [key]: value };
    updateActivity({ data: newData });
  };

  const setImage = (imageUrl: string) => {
    const { object } = data;
    updateActivity({ data: { ...data, object: { ...object, imageUrl } } });
  };

  const onNext = () => {
    router.push('/creer-une-histoire/2');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Inventez et dessinez un objet magique</h1>
          <p className="text">
            Cet objet, tout comme le lieu que vous choisirez à l’étape suivante, est magique ! Grâce à leurs pouvoirs, le village idéal a atteint
            l’objectif du développement durable que vous choisirez en étape 3.{' '}
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                {
                  <>
                    <Button
                      name="video"
                      style={{ width: '100%' }}
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setIsImageModalOpen(!isImageModalOpen);
                      }}
                    >
                      <UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }}>
                        <Image layout="fill" objectFit="contain" src={data?.object.imageUrl} />
                      </UploadIcon>
                    </Button>
                    <ImageModal
                      id={0}
                      isModalOpen={isImageModalOpen}
                      setIsModalOpen={setIsImageModalOpen}
                      imageUrl={data?.object?.imageUrl || ''}
                      setImageUrl={setImage}
                    />
                  </>
                }
                {/* <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%' }}>
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
                      {data?.object?.imageUrl ? (
                        <Image layout="fill" objectFit="contain" alt="image du plat" src={data?.object?.imageUrl} unoptimized />
                      ) : (
                        <AddIcon style={{ fontSize: '80px' }} />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
                <ImageModal
                  id={0}
                  isModalOpen={isImageModalOpen}
                  setIsModalOpen={setIsImageModalOpen}
                  imageUrl={data?.object?.imageUrl || ''}
                  setImageUrl={setImage}
                /> */}
                <span style={{ fontSize: '0.7rem', marginLeft: '1rem' }}>Ce champ est obligatoire</span>
              </div>
              <TextField
                id="standard-multiline-static"
                label="Décrivez l’objet magique"
                // value={data?.object.description}
                onChange={dataChange('description')}
                multiline
                variant="outlined"
                style={{ width: '100%', marginTop: '25px', color: 'primary' }}
                inputProps={{
                  maxLength: 400,
                }}
              />
              <div style={{ width: '100%', textAlign: 'right' }}>
                <span className="text text--small">/400</span>
              </div>
            </Grid>
          </Grid>
        </div>
        <StepsButton next="/creer-une-histoire/2" />
      </div>
    </Base>
  );
};
export default StoryStep1;
