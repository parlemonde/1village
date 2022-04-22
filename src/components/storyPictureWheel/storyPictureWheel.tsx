/* eslint-disable no-console */
import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Grid, Typography, CardMedia, Tooltip } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useImageStoryRequests } from 'src/services/useImagesStory';
import SlotMachineHandle from 'src/svg/story-activity/slot-machine-handle.svg';
import SlotMachine from 'src/svg/story-activity/slot-machine.svg';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import type { StoryElement } from 'types/story.type';

interface StoryPictureWheelProps {
  objectImage: StoryElement;
  placeImage: StoryElement;
  oddImage: StoryElement;
  onImagesChange(objectImage: StoryElement, placeImage: StoryElement, oddImage: StoryElement): void;
  style?: React.CSSProperties;
}

const StoryPictureWheel = ({ objectImage, placeImage, oddImage, onImagesChange, style }: StoryPictureWheelProps) => {
  const { getRandomImagesData } = useImageStoryRequests();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [ableToRotate, setAbleToRotate] = React.useState(false);
  const [rotate, setRotate] = React.useState(0);
  const [rolling, setRolling] = React.useState(false);
  const [storyActivities, setStoryActivities] = React.useState<Activity[]>([]);

  const [objectRandomImages, setObjectRandomImages] = React.useState<StoryElement[]>([]);
  const [placeRandomImages, setPlaceRandomImages] = React.useState<StoryElement[]>([]);
  const [oddRandomImages, setOddRandomImages] = React.useState<StoryElement[]>([]);

  const slotRef = [React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null)];

  // TODO: implement function to block rotate handle if activities.length <= 1
  React.useEffect(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village?.id,
          type: ActivityType.STORY + ',' + ActivityType.RE_INVENT_STORY,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          const storyActivities = response.data;
          setStoryActivities(storyActivities as Activity[]);
          if (storyActivities.length <= 1) {
            setAbleToRotate(false);
          } else {
            setAbleToRotate(true);
          }
        }
      });
    }
  }, [ableToRotate, axiosLoggedRequest, village]);

  //Get Random Images from DB
  const getRandomImages = React.useCallback(async () => {
    const images = await getRandomImagesData();
    //Une fois images récuperé il faudrait faire une function pour trier les informations qu'on a bseoin
    //et transformer en storyElement
    //TODO : ! Factoriser ici
    const objectTransformed = [] as StoryElement[];
    images.objects.forEach((image: { id: number; imageUrl: string; inspiredStoryId: number }) => {
      objectTransformed.push({ imageId: image.id, imageUrl: image.imageUrl, description: '', inspiredStoryId: image.inspiredStoryId });
    });
    setObjectRandomImages(objectTransformed);

    const placeTransformed = [] as StoryElement[];
    images.places.forEach((image: { id: number; imageUrl: string; inspiredStoryId: number }) => {
      placeTransformed.push({ imageId: image.id, imageUrl: image.imageUrl, description: '', inspiredStoryId: image.inspiredStoryId });
    });
    setPlaceRandomImages(placeTransformed);

    const oddTransformed = [] as StoryElement[];
    images.odds.forEach((image: { id: number; imageUrl: string; inspiredStoryId: number }) => {
      oddTransformed.push({ imageId: image.id, imageUrl: image.imageUrl, description: '', inspiredStoryId: image.inspiredStoryId });
    });
    setOddRandomImages(oddTransformed);
  }, [getRandomImagesData]);

  //Get random images when index page is launch only if no activityId in url
  //or when wheel is operated
  const imagesFetched = React.useRef(false);
  React.useEffect(() => {
    if (!imagesFetched.current) {
      getRandomImages().catch();
      imagesFetched.current = true;
    }
  }, [getRandomImages]);
  // storyObjectImages

  React.useEffect(() => {
    // If no imageID (the activity has been already created) => automatically set image to activity data
    if (objectRandomImages.length > 0 && objectImage.imageUrl === '') {
      onImagesChange(objectRandomImages[0], placeRandomImages[0], oddRandomImages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectRandomImages, placeRandomImages, oddRandomImages]);

  // to trigger handle rotate
  const handleRotate = () => {
    if (ableToRotate === true) {
      setRotate(rotate + 1);
    }
  };

  // to trigger rolling and maintain state
  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
    }, 700);
    // looping through all 3 slots to start rolling
    const newValues = [] as StoryElement[];
    slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selectedIndex = triggerSlotRotation(slot.current);
      if (i + 1 == 1) {
        newValues.push(objectRandomImages[selectedIndex]);
      } else if (i + 1 == 2) {
        newValues.push(placeRandomImages[selectedIndex]);
      } else {
        newValues.push(oddRandomImages[selectedIndex]);
      }
    });

    onImagesChange(newValues[0], newValues[1], newValues[2]);
  };

  // this will create a rolling effect and return random selected option
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerSlotRotation = (ref: any) => {
    function setTop(top: number) {
      ref.style.top = `${top}px`;
    }
    const options = ref.children;
    const randomOption = Math.floor(Math.random() * ref.children.length);
    const choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return randomOption;
  };

  return (
    <>
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: '1' }}>
        <Grid
          container
          spacing={1}
          item
          xs={5}
          sx={{
            boxSizing: 'border-box',
            width: 'inherit',
            paddingRight: '8px',
            zIndex: '2',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Paper elevation={0}>
              <SlotMachine style={{ height: '25rem', width: '25rem' }} />
            </Paper>
            <div>
              {storyActivities.length <= 1 && ableToRotate === false ? (
                <Tooltip title="Créez au moins 2 histoires" followCursor>
                  <div>
                    <SlotMachineHandle
                      style={{
                        display: 'block',
                        marginLeft: '-3rem',
                        marginTop: '5rem',
                        height: '10rem',
                        width: '10rem',
                      }}
                      className="handle"
                    />
                  </div>
                </Tooltip>
              ) : (
                <div className={!rolling ? 'roll rolling' : 'roll'} onClick={!rolling ? roll : undefined}>
                  <SlotMachineHandle
                    style={{
                      ...style,
                      display: 'block',
                      marginLeft: '-3rem',
                      marginTop: '5rem',
                      height: '10rem',
                      width: '10rem',
                    }}
                    className="handle"
                    onClick={handleRotate}
                    onAnimationEnd={() => setRotate(0)}
                    rotate={rotate}
                  />
                </div>
              )}
            </div>
          </Box>

          {objectImage && placeImage && oddImage && (
            <div className="SlotMachine">
              <div className="cards">
                <div className="slot">
                  <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                    Objet
                  </Typography>
                  <section>
                    <div className="container" ref={slotRef[0]}>
                      {objectRandomImages &&
                        objectRandomImages.map((obj, i) => (
                          <div className="object" key={i}>
                            <CardMedia
                              sx={{ borderRadius: '0.5rem', mt: 1 }}
                              component="img"
                              height="70"
                              image={obj.imageUrl ? obj.imageUrl : ''}
                              alt="objet de l'histoire"
                            />
                          </div>
                        ))}
                    </div>
                  </section>
                </div>
                <div className="slot">
                  <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                    Lieu
                  </Typography>
                  <section>
                    <div className="container" ref={slotRef[1]}>
                      {placeRandomImages &&
                        placeRandomImages.map((obj, i) => (
                          <div key={i}>
                            <CardMedia
                              sx={{ borderRadius: '0.5rem', mt: 1 }}
                              component="img"
                              height="70"
                              image={obj.imageUrl ? obj.imageUrl : ''}
                              alt="objet de l'histoire"
                            />
                          </div>
                        ))}
                    </div>
                  </section>
                </div>
                <div className="slot">
                  <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                    ODD
                  </Typography>
                  <section>
                    <div className="container" ref={slotRef[2]}>
                      {oddRandomImages &&
                        oddRandomImages.map((obj, i) => (
                          <div key={i}>
                            <CardMedia
                              sx={{ borderRadius: '0.5rem', mt: 1 }}
                              component="img"
                              height="70"
                              image={obj.imageUrl ? obj.imageUrl : ''}
                              alt="objet de l'histoire"
                            />
                          </div>
                        ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StoryPictureWheel;
