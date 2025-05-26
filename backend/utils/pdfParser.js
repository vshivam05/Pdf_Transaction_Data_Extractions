import pdf from "pdf-parse";
import fs from "fs/promises";
import path from "path";

const extractTransactionData = (text) => {
  const transactions = [];
  const blocks = text.split(/\n(?=\d{3,4}\/\d{4})/);
  for (const block of blocks) {
    const tx = {
      documentNumber: block.match(/\d{3,4}\/\d{4}/)?.[0] || "",
      executionDate: block.match(/\d{2}-[A-Za-z]{3}-\d{4}/)?.[0] || "",
      registrationDate: block.match(/\d{2}-[A-Za-z]{3}-\d{4}/g)?.[2] || "",
      nature: block.includes("Power of Attorney") ? "Power of Attorney" : "Conveyance",
      buyerName: block.match(/1\.\s(.+?)\n/)?.[1] || "",
      sellerName: block.match(/1\.\s(.+?)\n.*?1\.\s(.+?)\n/)?.[2] || "",
      considerationValue: block.match(/Consideration Value.*?:\s*(.*)/)?.[1] || "",
      marketValue: block.match(/Market Value.*?:\s*(.*)/)?.[1] || "",
      prNumber: block.match(/PR Number.*?:\s*(.*)/)?.[1] || "",
      propertyType: block.match(/Property Type.*?:\s*(.*)/)?.[1] || "",
      propertyExtent: block.match(/Property Extent.*?:\s*(.*)/)?.[1] || "",
      village: block.match(/Village.*?:\s*(.*)/)?.[1] || "",
      surveyNumber: block.match(/Survey No.*?:\s*(.*)/)?.[1] || "",
      plotNumber: block.match(/Plot No.*?:\s*(.*)/)?.[1] || "",
      scheduleRemarks: block.match(/Schedule Remarks.*?:\s*(.*)/)?.[1] || "",
      documentRemarks: block.match(/Document Remarks.*?:\s*(.*)/)?.[1] || ""
    };
    transactions.push(tx);
  }
  return transactions;
};

export default async function parsePDF(file) {
  let dataBuffer;

  if (Buffer.isBuffer(file)) {
    dataBuffer = file;
  } else if (typeof file === 'string') {
    try {
      const fileExists = await fs.access(file).then(() => true).catch(() => false);
      if (!fileExists) {
        console.warn(`Warning: File not found at path: ${file}`);
        return []; // return an empty array instead of throwing error
      }
      dataBuffer = await fs.readFile(file);
    } catch (err) {
      console.error(`Error reading file at ${file}:`, err);
      return []; // return empty array on error
    }
  } else {
    throw new Error("Invalid input to parsePDF: Must be a Buffer or valid file path");
  }

  const { text } = await pdf(dataBuffer);
  return extractTransactionData(text);
}
