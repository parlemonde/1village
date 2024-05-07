import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfDisplay({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
      <Page width={380} renderTextLayer={false} renderAnnotationLayer={false} pageNumber={numPages} pageIndex={0} />
    </Document>
  );
}
