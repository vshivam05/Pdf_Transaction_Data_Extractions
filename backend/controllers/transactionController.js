import fs from "fs/promises";
import TransactionService from "../services/transactionService.js";
import Transaction from "../models/Transaction.js";

export const uploadPDF = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);
    const buffer = await fs.readFile(req.file.path);  // Read the uploaded file
    const result = await TransactionService.processPDF(buffer);
    await fs.unlink(req.file.path);  // Delete the file after processing (optional)
    res.status(201).json(result);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ message: "Failed to process PDF" });
  }
};

export const searchTransactions = async (req, res) => {
  try {
    const { buyerName, sellerName, houseNumber, surveyNumber, documentNumber } = req.query;

    const filter = {};
    if (buyerName) filter.buyerName = { $regex: buyerName, $options: "i" };
    if (sellerName) filter.sellerName = { $regex: sellerName, $options: "i" };
    if (houseNumber) filter.houseNumber = { $regex: houseNumber, $options: "i" };
    if (surveyNumber) filter.surveyNumber = { $regex: surveyNumber, $options: "i" };
    if (documentNumber) filter.documentNumber = { $regex: documentNumber, $options: "i" };

    const results = await Transaction.find(filter);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ message: "Failed to search transactions" });
  }
};
