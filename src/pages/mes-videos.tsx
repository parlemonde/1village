import { useSnackbar } from 'notistack';
import React from 'react';
import { useQueryClient } from 'react-query';

import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { PageLayout } from 'src/components/PageLayout';
import { VideoTable } from 'src/components/VideoTable';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import { useVideos } from 'src/services/useVideos';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Video } from 'types/video.type';

const MesVideos = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { videos } = useVideos();
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);

  const deleteVideo = (id: number) => async () => {
    const response = await axiosRequest({
      method: 'DELETE',
      url: `/videos/${id}`,
    });
    if (response.error) {
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('Vidéo supprimée avec succès !', {
        variant: 'success',
      });
      queryClient.invalidateQueries('videos');
    }
  };

  return (
    <Base>
      <PageLayout>
        <div className="width-900" style={{ overflow: 'auto' }}>
          <h1>{'Mes vidéos'}</h1>
          {videos.length > 0 ? (
            <VideoTable
              videos={videos}
              onDelete={deleteVideo}
              onView={(video) => {
                setSelectedVideo(video);
              }}
            />
          ) : (
            <p>{"Vous n'avez pas encore mis en ligne de vidéos !"}</p>
          )}
        </div>

        <Modal
          title={`Vidéo: ${selectedVideo?.name || ''}`}
          cancelLabel="Fermer"
          onClose={() => {
            setSelectedVideo(null);
          }}
          open={selectedVideo !== null}
          ariaDescribedBy="video-desc"
          ariaLabelledBy="video-title"
          fullWidth
          maxWidth="md"
        >
          <div>
            {selectedVideo !== null && <VideoView id={selectedVideo.id} value={`https://player.vimeo.com/video/${selectedVideo.id}`}></VideoView>}
          </div>
        </Modal>
      </PageLayout>
    </Base>
  );
};

export default MesVideos;
