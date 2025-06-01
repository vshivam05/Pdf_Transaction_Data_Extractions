import fs from "fs/promises";
import TransactionService from "../services/transactionService.js";
import Transaction from "../models/Transaction.js";

export const uploadPDF = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);
    const buffer = await fs.readFile(req.file.path); // Read the uploaded file
    const result = await TransactionService.processPDF(buffer);
    result.filename = req.file.filename;
    // await fs.unlink(req.file.path);  // Delete the file after processing (optional)
    // Add filename to result for frontend preview
    // console.log("file name",req.file.filename);
    // res.status(201).json(result);
    res.status(201).json({
      filename: req.file.filename,
      ...result,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ message: "Failed to process PDF" });
  }
};

export const searchTransactions = async (req, res) => {
  try {
    const { plotNumber, registrationDate, documentNumber } =
      req.query;

    const filter = {};
    if (plotNumber) filter.plotNumber = { $regex: plotNumber, $options: "i" };
    if (registrationDate)
      filter.registrationDate = { $regex: registrationDate, $options: "i" };
    // if (houseNumber) filter.plotNumber = { $regex: houseNumber, $options: "i" };
    // if (surveyNumber)
    //   filter.surveyNumber = { $regex: surveyNumber, $options: "i" };
    if (documentNumber)
      filter.documentNumber = { $regex: documentNumber, $options: "i" };

    const results = await Transaction.find(filter);
    // console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ message: "Failed to search transactions" });
  }
};
