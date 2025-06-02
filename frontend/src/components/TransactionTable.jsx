

import React, { useState, useEffect } from "react";

export default function TransactionTable({ transactions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Reset currentPage to 1 whenever transactions change
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const totalPages = Math.ceil((transactions.length - 1) / rowsPerPage);
  const startIdx = 1 + (currentPage - 1) * rowsPerPage;
  const currentRows = transactions.slice(startIdx, startIdx + rowsPerPage);

  if (transactions.length === 0) {
    return <p className="text-gray-500">No transactions found.</p>;
  }

  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > 3) {
    if (currentPage === 1) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Document_Number
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Market_Value
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Plot_Number
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Registration_Date
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                schedule_Remarks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRows.map((tx, idx) => (
              <tr key={tx._id || `${tx.documentNumber}-${idx}`}>
                <td className="px-4 py-2 text-sm text-gray-700 break-words max-w-[150px]">
                  {tx.documentNumber}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 break-words max-w-[150px]">
                  {tx.considerationValue?.slice(0, 14)}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-900 break-words max-w-[150px]">
                  {tx.plotNumber?.slice(0, 14)}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-900 break-words max-w-[150px]">
                  {tx.registrationDate}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-900 break-words max-w-[200px]">
                  {tx.scheduleRemarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
