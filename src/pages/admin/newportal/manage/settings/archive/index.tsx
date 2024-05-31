import Link from 'next/link';
import React, { useState } from 'react';

import { Typography, Box, List, ListItem } from '@mui/material';

import { ArchiveModal } from 'src/components/admin/manage/settings/ArchiveModal';
import { RedButton } from 'src/components/buttons/RedButton';
import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const Archive = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user?.type === UserType.SUPER_ADMIN;
  const archives = ['1V 2020/21', '1V 2021/22', '1V 2022/23'];
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être super admin.</h1>;
  }

  const handleArchiveClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleArchiveConfirm = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Archiver</h1>
        </div>
      </Link>
      <p>Archiver 1Village va fermer l&apos;accès à tous les utilisateurs à la plateforme. Voilà les anciennes archives d&apos;1Village :</p>
      <Box display="flex" flexDirection="column" alignItems="center">
        <List>
          {archives.map((archive, index) => (
            <ListItem key={index}>
              <Link href={`/archives/${archive}`}>
                <Typography variant="body1">{archive}</Typography>
              </Link>
            </ListItem>
          ))}
        </List>
        <Box mt={4}>
          <RedButton onClick={handleArchiveClick} variant="contained" size="large" fullWidth>
            Archiver
          </RedButton>
        </Box>
      </Box>
      <ArchiveModal open={isModalOpen} onClose={handleModalClose} onConfirm={handleArchiveConfirm} />
    </div>
  );
};

export default Archive;
