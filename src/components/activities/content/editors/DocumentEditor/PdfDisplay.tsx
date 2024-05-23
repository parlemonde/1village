import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Button } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
export default function PdfDisplay({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  // function handlePages(){
  //   if()
  // }
  return (
    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
      <Page width={380} pageNumber={1} />
      <p>
        Page {pageNumber} sur {numPages}
      </p>
      <Button onClick={() => setPageNumber(pageNumber + 1)}>+</Button>
      <Button onClick={() => setPageNumber(pageNumber - 1)}>-</Button>
    </Document>
  );
}
