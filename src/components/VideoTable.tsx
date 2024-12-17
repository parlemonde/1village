import VisibilityIcon from '@mui/icons-material/Visibility';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip, IconButton } from '@mui/material';
import React from 'react';

import { DeleteButton } from './buttons/DeleteButton';
import { bgPage } from 'src/styles/variables.const';
import type { Video } from 'types/video.type';

interface VideoTableProps {
  videos: Video[];
  onView: (video: Video) => void;
  onDelete: (id: number) => void;
}

export const VideoTable: React.FC<VideoTableProps> = ({ videos, onView, onDelete }) => {
  const cellStyles = {
    padding: '5px',
    margin: 0,
  };

  return (
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
            <TableCell sx={(theme) => ({ [theme.breakpoints.only('xs')]: cellStyles })} align="right" padding="none" style={{ minWidth: '96px' }}>
              <Tooltip title="Regarder">
                <IconButton
                  aria-label="Voir"
                  onClick={() => {
                    onView(video);
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
                  onDelete={() => onDelete(video.id)}
                  confirmLabel="Voulez vous vraiment supprimer cette vidéo ? Attention, elle ne sera plus accessible par les activités qui l'utilisent."
                />
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
