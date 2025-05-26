// import fs from "fs";
// import TransactionService from "../services/transactionService.js";

// export const uploadPDF = async (req, res) => {
//     console.log("from the controller upload pdf",req.body)
//   try {
//     const fileBuffer = fs.readFileSync(req.file.path);
//     const result = await TransactionService.processPDF(fileBuffer);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error("Controller Error:", error);
//     res.status(500).json({ message: "Failed to process PDF" });
//   }
// };
import fs from "fs/promises";
import TransactionService from "../services/transactionService.js";

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

