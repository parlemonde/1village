import Image from 'next/image';
import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '45%',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  // p: 4,
};

type LightBoxProps = {
  url: string;
  children?: JSX.Element;
};

export const LightBox = ({ url, children }: LightBoxProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>{children}</div>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Image layout="responsive" objectFit="contain" width="100%" height="100%" alt="image du plat" unoptimized src={url} />
        </Box>
      </Modal>
    </>
  );
};
