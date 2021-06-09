import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, withStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { UserContext } from 'src/contexts/userContext';
import { useVideos } from 'src/services/useVideos';
import { bgPage } from 'src/styles/variables.const';
import type { Video } from 'types/video.type';

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      backgroundColor: 'white',
      '&:nth-of-type(even)': {
        backgroundColor: bgPage,
      },
      '&.sortable-ghost': {
        opacity: 0,
      },
    },
  }),
)(TableRow);

const MesVideos: React.FC = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { videos } = useVideos();
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);

  const deleteVideo = (id: number) => async () => {
    const response = await axiosLoggedRequest({
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
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>{'Mes vidéos'}</h1>
          {videos.length > 0 ? (
            <Table size="medium" style={{ marginTop: '1rem' }}>
              <TableHead style={{ borderBottom: '1px solid white' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Nom de la vidéo</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Lien de la vidéo (URL)</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video, index) => (
                  <StyledTableRow key={video.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{video.name}</TableCell>
                    <TableCell>https://player.vimeo.com/video/{video.id}</TableCell>
                    <TableCell align="right" padding="none" style={{ minWidth: '96px' }}>
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
                  </StyledTableRow>
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
      </div>
    </Base>
  );
};

export default MesVideos;
