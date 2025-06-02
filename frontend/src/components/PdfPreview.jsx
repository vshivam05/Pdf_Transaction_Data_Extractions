

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function PdfPreview({ url }) {
  if (!url) return <p>No PDF selected</p>;
  return (
    <div className="w-full h-[600px] border border-gray-300 rounded">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
}
