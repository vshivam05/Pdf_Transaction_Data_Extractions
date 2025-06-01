// import React, { useState, useEffect } from "react";
// import TransactionTable from "./TransactionTable";
// import PdfPreview from "./PdfPreview";
// import { API_URL } from "../API";
// export default function Dashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchTransactions = async () => {
//     try {
//       const res = await fetch(`${API_URL}/transactions`);
//       if (!res.ok) throw new Error("Failed to fetch transactions");
//       const data = await res.json();
//       setTransactions(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Handle PDF upload
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     setError(null);
//     const fileInput = e.target.elements.pdf;
//     if (!fileInput.files.length) {
//       setError("Please select a PDF file to upload");
//       return;
//     }
//     const file = fileInput.files[0];
//     const formData = new FormData();
//     formData.append("pdf", file);

//     setUploading(true);
//     try {
//       const res = await fetch(`${API_URL}/upload`, {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) throw new Error("Upload failed");
//       const data = await res.json();
//       // Assuming response contains uploaded PDF URL or filename
// Use filename from response to set PDF preview URL
// if (data.filename) {
//   setSelectedPdfUrl(`http://localhost:5000/uploads/${data.filename}`);
// } else {
//   setSelectedPdfUrl(null);
// }
//       fetchTransactions();
//       fileInput.value = null;
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
//       <form
//         onSubmit={handleUpload}
//         className="mb-6 flex items-center space-x-4"
//       >
//         <input
//           type="file"
//           name="pdf"
//           accept="application/pdf"
//           className="border border-gray-300 rounded p-2"
//         />
//         <button
//           type="submit"
//           disabled={uploading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {uploading ? "Uploading..." : "Upload PDF"}
//         </button>
//       </form>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       <div className="flex space-x-6">
//         <div className="flex-1">
//           <TransactionTable transactions={transactions} />
//         </div>
//         <div className="flex-1 border border-gray-300 rounded p-2 bg-white">
//           {selectedPdfUrl ? (
//             <PdfPreview url={selectedPdfUrl} />
//           ) : (
//             <p className="text-gray-500">No PDF selected</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// Dashboard.jsx
import React, { useState, useEffect } from "react";
import TransactionTable from "./TransactionTable";
import PdfPreview from "./PdfPreview";
import { API_URL } from "../API";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = React.useState({
    buyerName: "",
    sellerName: "",
    houseNumber: "",
    surveyNumber: "",
    documentNumber: "",
  });

  const fetchTransactions = async (filterParams = {}) => {
    try {
      const query = new URLSearchParams(filterParams).toString();
      const res = await fetch(`${API_URL}/transactions?${query}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      console.log("data from dashboard", data);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions(filters);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    const fileInput = e.target.elements.pdf;
    if (!fileInput.files.length) {
      setError("Please select a PDF file to upload");
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("pdf", file);

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("data file name from dashboard", data.filename);
      // Set the PDF URL based on your backend
      if (data.filename) {
        setSelectedPdfUrl(`http://localhost:5000/uploads/${data.filename}`);
      } else {
        setSelectedPdfUrl(null);
      }

      fetchTransactions(); // Refresh transactions
      fileInput.value = null; // Reset file input
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <form
        onSubmit={handleUpload}
        className="mb-6 flex items-center space-x-4"
      >
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          className="border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>

      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            name="buyerName"
            placeholder="Buyer Name"
            value={filters.buyerName}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 flex-1"
          />
          <input
            type="text"
            name="sellerName"
            placeholder="Seller Name"
            value={filters.sellerName}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 flex-1"
          />
          <input
            type="text"
            name="houseNumber"
            placeholder="House Number"
            value={filters.houseNumber}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 flex-1"
          />
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            name="surveyNumber"
            placeholder="Survey Number"
            value={filters.surveyNumber}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 flex-1"
          />
          <input
            type="text"
            name="documentNumber"
            placeholder="Document Number"
            value={filters.documentNumber}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 flex-1"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex space-x-6">
        <div className="flex-1">
          <TransactionTable transactions={transactions} />
        </div>
        <div className="flex-1 border border-gray-300 rounded p-2 bg-white">
          <PdfPreview url={selectedPdfUrl} />
        </div>
      </div>
    </div>
  );
}
