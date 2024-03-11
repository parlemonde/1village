import Image from 'next/image';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';

import AddIcon from '@mui/icons-material/Add';
import { ButtonBase } from '@mui/material';

import { KeepRatio } from 'src/components/KeepRatio';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { VideoModals } from 'src/components/activities/content/editors/VideoEditor/VideoModals';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import type { inputType } from 'src/config/games/games';
import { GameContext } from 'src/contexts/gameContext';
import { errorColor, primaryColor, bgPage } from 'src/styles/variables.const';

const GameMedia = ({ input }: { input: inputType }) => {
  const { updateGameConfig } = useContext(GameContext);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  const handleChange = (value: string) => {
    updateGameConfig(value, input);
  };

  const setImage = (value: string) => {
    updateGameConfig(value, input);
  };

  const handleImageError = () => {
    setIsError(true);
  };

  return (
    <>
      {input.type == 3 && (
        <div className="width-900">
          <div style={{ width: '50%', marginTop: '1rem', position: 'relative' }}>
            <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%', color: `${isError ? errorColor : primaryColor}` }}>
              <KeepRatio ratio={3 / 3} width="100%">
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
                  {input.selectedValue ? (
                    <>
                      <Image layout="fill" objectFit="cover" alt="Image à deviner" src={input.selectedValue} unoptimized onError={handleImageError} />
                      {isError ? (
                        <p style={{ fontSize: '1rem' }}>Oups un problème est survenue. Veuillez vérifiez votre url ou le format d&apos;image.</p>
                      ) : null}
                    </>
                  ) : (
                    <AddIcon style={{ fontSize: '80px' }} />
                  )}
                </div>
              </KeepRatio>
            </ButtonBase>
            {input.selectedValue && (
              <div style={{ position: 'absolute', top: '0.25rem', right: '0.25rem' }}>
                <DeleteButton
                  onDelete={() => {
                    setIsError(false);
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
              imageUrl={input.selectedValue || ''}
              setImageUrl={setImage}
            />
          </div>
        </div>
      )}
      {input.type == 4 && (
        <div className="width-900">
          <div style={{ width: '50%', marginTop: '1rem', position: 'relative' }}>
            <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%', color: `${isError ? errorColor : primaryColor}` }}>
              <KeepRatio ratio={3 / 3} width="100%">
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
                  {input.selectedValue ? (
                    <>
                      <ReactPlayer width="100%" height="100%" light url={input.selectedValue || ''} controls />
                      {isError ? (
                        <p style={{ fontSize: '1rem' }}>Oups un problème est survenue. Veuillez vérifiez votre url ou le format de vidéo.</p>
                      ) : null}
                    </>
                  ) : (
                    <AddIcon style={{ fontSize: '80px' }} />
                  )}
                </div>
              </KeepRatio>
            </ButtonBase>
            {input.selectedValue && (
              <div style={{ position: 'absolute', top: '0.25rem', right: '0.25rem' }}>
                <DeleteButton
                  onDelete={() => {
                    setIsError(false);
                    setImage('');
                  }}
                  confirmLabel="Êtes-vous sur de vouloir supprimer la vidéo ?"
                  confirmTitle="Supprimer la vidéo"
                  style={{ backgroundColor: bgPage }}
                />
              </div>
            )}
            <VideoModals
              id={0}
              isModalOpen={isImageModalOpen}
              setIsModalOpen={setIsImageModalOpen}
              videoUrl={input.selectedValue || ''}
              setVideoUrl={handleChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GameMedia;
