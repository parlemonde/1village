import Image from 'next/image';
import * as React from 'react';

import { Modal } from '../Modal';

type LightBoxProps = {
  url: string;
  children: JSX.Element;
};

export const LightBox = ({ url, children }: LightBoxProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      <Modal
        open={isModalOpen}
        fullWidth
        maxWidth="md"
        noCancelButton
        onClose={() => {
          setIsModalOpen(false);
        }}
        ariaLabelledBy="lightBox-modal-title"
        ariaDescribedBy="lightBox-modal-description"
      >
        <Image layout="responsive" objectFit="contain" width="100%" height="70%" alt="" unoptimized src={url} />
      </Modal>
    </>
  );
};
