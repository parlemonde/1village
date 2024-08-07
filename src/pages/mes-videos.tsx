import { useSnackbar } from 'notistack';
import React from 'react';
import { useQueryClient } from 'react-query';

import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { PageLayout } from 'src/components/PageLayout';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { useVideos } from 'src/services/useVideos';
import { bgPage } from 'src/styles/variables.const';
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

  const cellStyles = {
    padding: '5px',
    margin: 0,
  };

  return (
    <Base>
      <PageLayout>
        <div className="width-900" style={{ overflow: 'auto' }}>
          <h1>{'Mes vidéos'}</h1>
          {videos.length > 0 ? (
            <Table size="medium" style={{ marginTop: '1rem' }}>
              <TableHead style={{ borderBottom: '1px solid white' }}>
                <TableRow>
                  <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })} style={{ fontWeight: 'bold' }}>
                    #
                  </TableCell>
                  <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })} style={{ fontWeight: 'bold' }}>
                    Nom de la vidéo
                  </TableCell>
                  <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })} style={{ fontWeight: 'bold' }}>
                    Lien de la vidéo (URL)
                  </TableCell>
                  <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })} style={{ fontWeight: 'bold' }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video, index) => (
                  <TableRow
                    key={video.id}
                    sx={{
                      backgroundColor: 'white',
                      '&:nth-of-type(even)': {
                        backgroundColor: bgPage,
                      },
                      '&.sortable-ghost': {
                        opacity: 0,
                      },
                    }}
                  >
                    <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })}>{index + 1}</TableCell>
                    <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })}>{video.name}</TableCell>
                    <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })}>https://player.vimeo.com/video/{video.id}</TableCell>
                    <TableCell
                      sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })}
                      align="right"
                      padding="none"
                      style={{ minWidth: '96px' }}
                    >
                      <Tooltip title="Regarder">
                        <IconButton
                          aria-label="Voir"
                          onClick={() => {
                            setSelectedVideo(video);
                          }}
                          size="small"
                          style={{ border: '1px solid', marginRight: '0.25rem' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <DeleteButton
                          color="red"
                          onDelete={deleteVideo(video.id)}
                          confirmLabel="Voulez vous vraiment supprimer cette vidéo ? Attention, elle ne sera plus accessible par les activités qui l'utilisent."
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
