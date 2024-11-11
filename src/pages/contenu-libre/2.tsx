import { TextField, Switch, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { isFreeContent } from 'src/activity-types/anyActivity';
import { getImage } from 'src/activity-types/freeContent.constants';
import type { FreeContentData } from 'src/activity-types/freeContent.types';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { LightBox } from 'src/components/lightbox/Lightbox';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { primaryColor } from 'src/styles/variables.const';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | undefined>(undefined);
  const [isAllImagesModalOpen, setIsAllImagesModalOpen] = React.useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  const data = (activity?.data as FreeContentData) || null;
  const errorSteps = React.useMemo(() => {
    if (activity !== null && activity.content.filter((c) => c.value.length > 0 && c.value !== '<p></p>\n').length === 0) {
      return [0];
    }
    return [];
  }, [activity]);
  const hasContentImages = React.useMemo(() => activity !== null && activity.content.some((c) => c.type === 'image'), [activity]);
  const imageUrl = React.useMemo(() => getImage(activity?.content ?? [], data), [activity, data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/contenu-libre/1');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/contenu-libre/1');
    }
  }, [activity, router]);

  if (!activity || !user) {
    return <Base></Base>;
  }

  const handlePinnedChange = () => {
    updateActivity({ isPinned: !activity.isPinned });
  };

  const handleUserChange = () => {
    updateActivity({ displayAsUser: !activity.displayAsUser });
  };

  const dataChange = (key: keyof FreeContentData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 400);
    const newData = { ...data, [key]: value };
    updateActivity({ data: newData });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/contenu-libre/3');
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['Contenu', 'Forme', 'Pré-visualiser']}
          urls={['/contenu-libre/1?edit', '/contenu-libre/2', '/contenu-libre/3']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Ajustez l&apos;apparence de votre publication</h1>
          <p className="text">
            Vous pouvez ajuster le titre, l&apos;extrait et l&apos;image à la une de votre publication qui sera intégrée sur le fil d&apos;actualité.
            Vous pouvez également décider de mettre votre publication à l&apos;avant, tout en haut du fil d&apos;actualité.
          </p>
          <TextField
            value={data.title}
            onChange={dataChange('title')}
            label="Titre de votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <TextField
            value={data.resume}
            onChange={dataChange('resume')}
            label="Extrait votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div>
            Épingler la publication ?
            <Switch checked={activity.isPinned} onChange={handlePinnedChange} value={activity.isPinned} color="primary" />
          </div>
          <div>
            Publier sous votre nom la publication ? (Pas Pelico)
            <Switch checked={activity.displayAsUser} onChange={handleUserChange} value={activity.displayAsUser} color="primary" />
          </div>
          <p className="text">Image à la une :</p>
          <div className="editor" style={{ marginTop: 0 }}>
            <div className="image-editor editor__container">
              <>
                {imageUrl && (
                  <div
                    style={{
                      width: '15rem',
                      height: '10rem',
                      borderRight: `1px dashed ${primaryColor}`,
                      position: 'relative',
                    }}
                  >
                    <LightBox url={imageUrl}>
                      <Image layout="fill" objectFit="contain" src={imageUrl} unoptimized />
                    </LightBox>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => {
                      setSelectedImageUrl(imageUrl);
                      if (hasContentImages) {
                        setIsAllImagesModalOpen(true);
                      } else {
                        setIsImageModalOpen(true);
                      }
                    }}
                  >
                    {imageUrl ? "Changer d'image" : 'Choisir une image'}
                  </Button>
                  {imageUrl && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => {
                        updateActivity({ data: { ...data, imageUrl: undefined, noImage: true } });
                      }}
                      sx={{ marginLeft: '0.5rem' }}
                    >
                      {"Retirer l'image"}
                    </Button>
                  )}
                </div>
              </>
            </div>
          </div>
          <h2 style={{ margin: '1rem 0 0.5rem 0' }}>Aperçu de votre publication</h2>
          <p className="text">Voilà à quoi ressemblera votre publication dans le fil d&apos;activité</p>
          <ActivityCard activity={activity} user={user} noButtons />
          <StepsButton prev="/contenu-libre/1" next={onNext} />
        </div>
      </PageLayout>

      {/* All Images modal */}
      <Modal
        open={isAllImagesModalOpen}
        fullWidth
        noCloseOutsideModal
        maxWidth="md"
        title="Choisir une image"
        confirmLabel="Choisir"
        onConfirm={() => {
          updateActivity({ data: { ...data, imageUrl: selectedImageUrl, noImage: false } });
          setSelectedImageUrl(undefined);
          setIsAllImagesModalOpen(false);
        }}
        onClose={() => {
          setSelectedImageUrl(undefined);
          setIsAllImagesModalOpen(false);
        }}
        ariaLabelledBy={`image-all-edit`}
        ariaDescribedBy={`image-all-edit-desc`}
      >
        <h2>Choisir une image depuis le contenu :</h2>
        <div style={{ width: '100%', overflow: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
            {activity.content
              .filter((c) => c.type === 'image')
              .map((c, index) => (
                <div
                  key={index}
                  style={{ margin: '0.5rem', cursor: 'pointer', border: c.value === selectedImageUrl ? `2px solid ${primaryColor}` : 'none' }}
                  onClick={() => {
                    setSelectedImageUrl(c.value);
                  }}
                >
                  <Image layout="fixed" width="125px" height="125px" objectFit="contain" src={c.value} unoptimized />
                </div>
              ))}
          </div>
        </div>
        <h2>Où importer une nouvelle image :</h2>
        <div className="text-center">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => {
              setIsAllImagesModalOpen(false);
              setIsImageModalOpen(true);
            }}
          >
            {'Choisir une autre image'}
          </Button>
        </div>
      </Modal>

      {/* Other image uploader */}
      <ImageModal
        id={0}
        isModalOpen={isImageModalOpen}
        setIsModalOpen={setIsImageModalOpen}
        imageUrl={imageUrl || ''}
        setImageUrl={(newUrl) => {
          updateActivity({ data: { ...data, imageUrl: newUrl, noImage: false } });
          setSelectedImageUrl(undefined);
        }}
      />
    </Base>
  );
};

export default ContenuLibre;
