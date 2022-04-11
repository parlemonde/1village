import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Grid, Typography, CardMedia } from '@mui/material';

import SlotMachineHandle from 'src/svg/story-activity/slot-machine-handle.svg';
import SlotMachine from 'src/svg/story-activity/slot-machine.svg';
import type { ImagesRandomData, StoriesData } from 'types/story.type';

interface StoryPictureWheelProps {
  images: StoriesData | ImagesRandomData;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const StoryPictureWheel = ({ images, style, onClick }: StoryPictureWheelProps) => {
  const [rotate, setRotate] = React.useState(0);
  const [rolling, setRolling] = React.useState(false);
  const [objectImg, setObjectImg] = React.useState(images.object.imageUrl);
  const [placeImg, setPlacetImg] = React.useState(images.place.imageUrl);
  const [oddImg, setOddImg] = React.useState(images.odd.imageUrl);

  const slotRef = [React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null)];

  // storyObjectImages
  const objRandomImages: string[] = [];
  const objImages = Object.values(images)[0].imageUrl;
  objRandomImages.push(objImages);

  // storyPlaceImages
  const placeRandomImages: string[] = [];

  const placeImages = Object.values(images)[1].imageUrl;
  placeRandomImages.push(placeImages);

  // storyObjectImages
  const oddRandomImages: string[] = [];

  const oddImages = Object.values(images)[2].imageUrl;
  oddRandomImages.push(oddImages);

  // to trigger handle rotate
  const handleRotate = () => {
    onClick && onClick();
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
      const selected = triggerSlotRotation(slot.current);
      if (i + 1 == 1) setObjectImg(selected);
      else if (i + 1 == 2) setPlacetImg(selected);
      else setOddImg(selected);
    });
  };

  // this will create a rolling effect and return random selected option
  const triggerSlotRotation = (ref) => {
    function setTop(top: number) {
      ref.style.top = `${top}px`;
    }
    const options = ref.children;
    const randomOption = Math.floor(Math.random() * objRandomImages.length);
    const choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return objRandomImages[randomOption];
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
                      {objRandomImages.map((image, i) => (
                        <div className="object" key={i}>
                          <CardMedia sx={{ borderRadius: '0.5rem', mt: 1 }} component="img" height="70" image={image} alt="objet de l'histoire" />
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
                      {placeRandomImages.map((image, i) => (
                        <div key={i}>
                          <CardMedia sx={{ borderRadius: '0.5rem', mt: 1 }} component="img" height="70" image={image} alt="objet de l'histoire" />
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
                      {oddRandomImages.map((image, i) => (
                        <div key={i}>
                          <CardMedia sx={{ borderRadius: '0.5rem', mt: 1 }} component="img" height="70" image={image} alt="objet de l'histoire" />
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
