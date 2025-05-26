import express from "express";
import dbConnect from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
// app.use()

app.use("/api", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
