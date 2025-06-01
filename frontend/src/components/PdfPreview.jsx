

// PdfPreview.jsx
// import React from "react";

// export default function PdfPreview({ url }) {
//   if (!url) return <p className="text-gray-500">No PDF selected.</p>;

//   return (
//     <iframe
//       src={url}
//       title="PDF Preview"
//       className="w-full h-[600px] border border-gray-300 rounded"
//       sandbox="allow-same-origin allow-scripts"
//     >
//       Your browser does not support PDF preview.
//       <a href={url} target="_blank" rel="noopener noreferrer">
//         Click here to view.
//       </a>
//     </iframe>
//   );
// }

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
