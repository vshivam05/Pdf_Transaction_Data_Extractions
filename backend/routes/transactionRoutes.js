import express from "express";
import multer from "multer";
import { uploadPDF } from "../controllers/transactionController.js";

const router = express.Router();
import {upload} from "../middlewares/uploadMiddleware.js"

router.post("/upload", upload.single("pdf"), uploadPDF);

export default router;
