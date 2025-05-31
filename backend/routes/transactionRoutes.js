import express from "express";
import multer from "multer";
import {
  uploadPDF,
  searchTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();
import { upload } from "../middlewares/uploadMiddleware.js";

router.post("/upload", upload.single("pdf"), uploadPDF);
router.get("/transactions", searchTransactions);

export default router;
