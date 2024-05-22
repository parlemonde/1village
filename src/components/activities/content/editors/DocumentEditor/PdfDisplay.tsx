import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfDisplay({ url }: { url: string }) {
  return (
    <Document file={url}>
      <Page width={380} renderTextLayer={true} renderAnnotationLayer={true} renderMode={'svg'} pageNumber={1} />
    </Document>
  );
}
