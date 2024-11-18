import Link from 'next/link';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import { Typography, Box, List, ListItem } from '@mui/material';

import { useListArchives } from 'src/api/archive/archive.get';
import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const Archive = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR];
  const [archives, setArchives] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const { data: listArchive, isError: listArchiveError, isLoading: listArchiveLoading } = useListArchives();

  useEffect(() => {
    if (listArchive) {
      setArchives(listArchive);
    }
    if (listArchiveError) {
      enqueueSnackbar("Une erreur s'est produite lors de la récuperation des archives existantes !", {
        variant: 'error',
      });
    }
  }, [listArchive, listArchiveError, enqueueSnackbar]);

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être super admin.</h1>;
  }

  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Archiver</h1>
        </div>
      </Link>
      <p>Voilà la liste des archives existantes. Si tu souhaites effectuer une nouvelle archive d&apos;1Village, adresse toi au pôle tech.</p>
      <Box display="flex" flexDirection="column" alignItems="center">
        {listArchiveLoading ? (
          <div>Chargement...</div>
        ) : (
          <List>
            {archives.map((archive, index) => (
              <ListItem key={index}>
                <Link href={`/api/archives/${archive}`} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer">
                    <Typography variant="body1">{archive}</Typography>
                  </a>
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
};

export default Archive;
