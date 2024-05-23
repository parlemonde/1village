import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export default function PdfDisplay({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Document options={options} file={url} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(Array(numPages).keys()).map((v) => (
        <div
          key={v}
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Page width={380} pageNumber={v + 1} />
        </div>
      ))}
    </Document>
  );
}
