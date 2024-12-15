import Image from 'next/image';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Modal } from '../Modal';

type LightBoxProps = {
  url: string;
  children: JSX.Element;
  isPDF?: boolean;
};

export const LightBox = ({ url, children, isPDF }: LightBoxProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const options = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  };

  const [numPages, setNumPages] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
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
        {isPDF ? (
          <Document options={options} file={url} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(Array(numPages).keys()).map((v) => (
              <div
                key={v}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Page width={430} scale={2.0} pageNumber={v + 1} />
              </div>
            ))}
          </Document>
        ) : (
          <Image layout="responsive" objectFit="contain" width="100%" height="70%" alt="" unoptimized src={url} />
        )}
      </Modal>
    </>
  );
};
