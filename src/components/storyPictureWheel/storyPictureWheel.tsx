import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Grid, Typography, CardMedia } from '@mui/material';

import { useImageStoryRequests } from 'src/services/useImagesStory';
import SlotMachineHandle from 'src/svg/story-activity/slot-machine-handle.svg';
import SlotMachine from 'src/svg/story-activity/slot-machine.svg';
import type { StoriesData, StoryElement } from 'types/story.type';

interface StoryPictureWheelProps {
  objectImage: StoryElement;
  placeImage: StoryElement;
  oddImage: StoryElement;
  style?: React.CSSProperties;
}

const StoryPictureWheel = ({ objectImage, placeImage, oddImage, style }: StoryPictureWheelProps) => {
  const { getRandomImagesData, getRandomImagesStory } = useImageStoryRequests();
  const [rotate, setRotate] = React.useState(0);
  const [rolling, setRolling] = React.useState(false);

  const [objectRandomImages, setObjectRandomImages] = React.useState<StoryElement[]>([]);
  const [placeRandomImages, setPlaceRandomImages] = React.useState<StoryElement[]>([]);
  const [oddRandomImages, setOddRandomImages] = React.useState<StoryElement[]>([]);
  //When activityId is present
  const [objectImg, setObjectImg] = React.useState<StoryElement>(objectImage);
  const [placeImg, setPlaceImg] = React.useState<StoryElement>(placeImage);
  const [oddImg, setOddImg] = React.useState<StoryElement>(oddImage);

  console.table({ objectImg, placeImg, oddImg });
  const slotRef = [React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null)];

  //Get Random Images from DB
  const getRandomImages = React.useCallback(async () => {
    console.log('get random images');
    const images = await getRandomImagesData();
    //Une fois images récuperé il faudrait faire une function pour trier les informations qu'on a bseoin
    // et transformer en storyElement
    console.log('fecthed images');
    console.log('images', images);
    //TODO : ! Factoriser ici
    const ojectTransformed = [] as StoryElement[];
    images.objects.forEach((image: { id: number; imageUrl: string; inspiredStoryId: number }) => {
      ojectTransformed.push({ imageId: image.id, imageUrl: image.imageUrl, description: '', inspiredStoryId: image.inspiredStoryId });
    });
    setObjectRandomImages(ojectTransformed);

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

    // If no activityID => automatically set image to activity data
    const image = await getRandomImagesStory();
    console.log('image', image);
    if (objectImg.imageUrl === '' && placeImg.imageUrl === '' && oddImg.imageUrl === '') {
      console.log('init empty images');
      setObjectImg({
        ...objectImage,
        imageUrl: image.object.imageUrl,
        imageId: image.object.id,
        description: '',
        inspiredStoryId: image.object.inspiredStoryId,
      });
      setPlaceImg({
        ...placeImage,
        imageUrl: image.place.imageUrl,
        imageId: image.place.id,
        description: '',
        inspiredStoryId: image.place.inspiredStoryId,
      });
      setOddImg({ ...oddImage, imageUrl: image.odd.imageUrl, imageId: image.odd.id, description: '', inspiredStoryId: image.odd.inspiredStoryId });

      setObjectRandomImages((prev) => [objectImg, ...prev]);
      setPlaceRandomImages((prev) => [placeImg, ...prev]);
      setOddRandomImages((prev) => [oddImg, ...prev]);
    }
  }, [getRandomImagesData, getRandomImagesStory]);
  console.log({ objectRandomImages });

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

  // to trigger handle rotate
  const handleRotate = () => {
    setRotate(rotate + 1);
  };

  // to trigger rolling and maintain state
  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
    }, 700);
    // looping through all 3 slots to start rolling
    slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selectedIndex = triggerSlotRotation(slot.current);
      console.log('selectedIndex', selectedIndex);
      if (i + 1 == 1)
        setObjectImg({ ...objectImg, imageId: objectRandomImages[selectedIndex].imageId, imageUrl: objectRandomImages[selectedIndex].imageUrl });
      else if (i + 1 == 2)
        setPlaceImg({ ...placeImg, imageId: placeRandomImages[selectedIndex].imageId, imageUrl: placeRandomImages[selectedIndex].imageUrl });
      else setOddImg({ ...oddImg, imageId: oddRandomImages[selectedIndex].imageId, imageUrl: oddRandomImages[selectedIndex].imageUrl });
    });
  };

  // this will create a rolling effect and return random selected option
  const triggerSlotRotation = (ref) => {
    function setTop(top: number) {
      ref.style.top = `${top}px`;
    }
    const options = ref.children;
    const randomOption = Math.floor(Math.random() * ref.children.length);
    const choosenOption = options[randomOption];
    console.log('options[randomOption]', options[randomOption]);
    console.log('choosenOption', choosenOption);
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
              <div className={!rolling ? 'roll rolling' : 'roll'} onClick={!rolling ? roll : undefined}>
                <SlotMachineHandle
                  style={{ ...style, display: 'block', marginLeft: '-3rem', marginTop: '5rem', height: '10rem', width: '10rem' }}
                  className="handle"
                  onClick={handleRotate}
                  onAnimationEnd={() => setRotate(0)}
                  wobble={rotate}
                />
              </div>
            </div>
          </Box>

          {objectImg && placeImg && oddImg && (
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
