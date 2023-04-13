import classNames from 'classnames';
import React from 'react';

import { Grid, Typography, CardMedia, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { useImageStories } from 'src/services/useImagesStory';
import SlotMachineHandle from 'src/svg/story-activity/slot-machine-handle.svg';
import SlotMachine from 'src/svg/story-activity/slot-machine.svg';
import type { StoryElement } from 'types/story.type';

type BackendImage = { id: number; imageUrl: string; inspiredStoryId: number };

interface StoryPictureWheelProps {
  initialObjectImage: StoryElement | null;
  initialPlaceImage: StoryElement | null;
  initialOddImage: StoryElement | null;
  onImagesChange(oddImage: StoryElement, objectImage: StoryElement, placeImage: StoryElement): void;
  style?: React.CSSProperties;
}

const StoryPictureWheel = ({ initialObjectImage, initialPlaceImage, initialOddImage, onImagesChange, style }: StoryPictureWheelProps) => {
  const { getRandomImagesData } = useImageStories();
  const [isRotating, setIsRotating] = React.useState(0);
  const [rolling, setRolling] = React.useState(false);

  const [allImages, setAllImages] = React.useState<{
    odd: StoryElement[];
    object: StoryElement[];
    place: StoryElement[];
  }>({
    odd: [],
    object: [],
    place: [],
  });

  const oddRandomImages = React.useMemo(
    () => (initialOddImage ? [initialOddImage, ...allImages.odd.filter((i) => i.imageId !== initialOddImage.imageId)] : allImages.odd),
    [initialOddImage, allImages],
  );
  const objectRandomImages = React.useMemo(
    () => (initialObjectImage ? [initialObjectImage, ...allImages.object.filter((i) => i.imageId !== initialObjectImage.imageId)] : allImages.object),
    [initialObjectImage, allImages],
  );
  const placeRandomImages = React.useMemo(
    () => (initialPlaceImage ? [initialPlaceImage, ...allImages.place.filter((i) => i.imageId !== initialPlaceImage.imageId)] : allImages.place),
    [initialPlaceImage, allImages],
  );

  const slotRef1 = React.useRef<HTMLDivElement | null>(null);
  const slotRef2 = React.useRef<HTMLDivElement | null>(null);
  const slotRef3 = React.useRef<HTMLDivElement | null>(null);

  const ableToRotate = oddRandomImages.length > 1 && objectRandomImages.length > 1 && placeRandomImages.length > 1;

  //Get Random Images from DB
  const getRandomImages = React.useCallback(async () => {
    const images = await getRandomImagesData();
    setAllImages({
      odd: images.odds.map((image: BackendImage) => ({
        imageId: image.id,
        imageUrl: image.imageUrl,
        description: '',
        inspiredStoryId: image.inspiredStoryId,
      })),
      object: images.objects.map((image: BackendImage) => ({
        imageId: image.id,
        imageUrl: image.imageUrl,
        description: '',
        inspiredStoryId: image.inspiredStoryId,
      })),
      place: images.places.map((image: BackendImage) => ({
        imageId: image.id,
        imageUrl: image.imageUrl,
        description: '',
        inspiredStoryId: image.inspiredStoryId,
      })),
    });
  }, [getRandomImagesData]);

  React.useEffect(() => {
    getRandomImages().catch();
  }, [getRandomImages]);

  React.useEffect(() => {
    if (oddRandomImages.length > 1 && objectRandomImages.length > 1 && placeRandomImages.length > 1) {
      onImagesChange(oddRandomImages[0], objectRandomImages[0], placeRandomImages[0]);
    }
    [slotRef1, slotRef2, slotRef3].forEach((slot) => {
      if (slot.current) {
        slot.current.style.top = '0px';
      }
    });
  }, [oddRandomImages, objectRandomImages, placeRandomImages, onImagesChange]);

  // to trigger handle rotate
  const handleRotate = () => {
    if (ableToRotate === true) {
      setIsRotating(isRotating + 1);
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
    [slotRef1, slotRef2, slotRef3].forEach((slot, i) => {
      // this will trigger rolling effect
      let selectedIndex;
      if (slot.current) selectedIndex = triggerSlotRotation(slot.current);
      if (i + 1 == 1 && selectedIndex !== undefined) {
        newValues.push(oddRandomImages[selectedIndex]);
      } else if (i + 1 == 2 && selectedIndex !== undefined) {
        newValues.push(objectRandomImages[selectedIndex]);
      } else {
        if (selectedIndex !== undefined) newValues.push(placeRandomImages[selectedIndex]);
      }
    });

    onImagesChange(newValues[0], newValues[1], newValues[2]);
  };

  // this will create a rolling effect and return random selected option
  const triggerSlotRotation = (ref: HTMLDivElement) => {
    function setTop(top: number) {
      ref.style.top = `${top}px`;
    }
    const options = ref.children;
    const randomOption = Math.floor(Math.random() * ref.children.length);
    const choosenOption = options[randomOption];
    setTop(-(choosenOption as HTMLElement).offsetTop + 2);
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
              {ableToRotate === false ? (
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
                    className={classNames('handle', { 'handle--is-rotating': isRotating })}
                    onClick={handleRotate}
                    onAnimationEnd={() => setIsRotating(0)}
                  />
                </div>
              )}
            </div>
          </Box>

          <div className="SlotMachine">
            <div className="cards">
              <div className="slot">
                <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                  ODD
                </Typography>
                <section>
                  <div className="container" ref={slotRef1}>
                    {oddRandomImages &&
                      oddRandomImages.map((obj, i) => (
                        <div key={i}>
                          <CardMedia
                            sx={{ borderRadius: '0.5rem', mt: 0.3, mb: 0.3 }}
                            component="img"
                            height="70"
                            image={obj.imageUrl ? obj.imageUrl : ''}
                            alt="odd de l'histoire"
                          />
                        </div>
                      ))}
                  </div>
                </section>
              </div>
              <div className="slot">
                <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                  Objet
                </Typography>
                <section>
                  <div className="container" ref={slotRef2}>
                    {objectRandomImages &&
                      objectRandomImages.map((obj, i) => (
                        <div className="object" key={i}>
                          <CardMedia
                            sx={{ borderRadius: '0.5rem', mt: 0.3, mb: 0.3 }}
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
                  <div className="container" ref={slotRef3}>
                    {placeRandomImages &&
                      placeRandomImages.map((obj, i) => (
                        <div key={i}>
                          <CardMedia
                            sx={{ borderRadius: '0.5rem', mt: 0.3, mb: 0.3 }}
                            component="img"
                            height="70"
                            image={obj.imageUrl ? obj.imageUrl : ''}
                            alt="lieu de l'histoire"
                          />
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default StoryPictureWheel;
