import Transaction from "../models/Transaction.js";
import parsePDF from "../utils/pdfParser.js";
import translate from "../utils/translator.js";

const processPDF = async (pdfBufferOrPath) => {
  // console.log("Processing PDF:", pdfBufferOrPath);
  const extractedData = await parsePDF(pdfBufferOrPath);
  // console.log("Extracted data: from service", extractedData[4]);
  if (extractedData.length === 0) {
    console.log("No transactions found or file not found.");
    return [];
  }

  // Translate extracted Tamil fields to English
  const translatedData = await translate(extractedData);
  console.log(translatedData[1]);
  // Save translated transactions to MongoDB
  const saved = await Transaction.insertMany(translatedData);
  return extractedData;
};

export default { processPDF };
