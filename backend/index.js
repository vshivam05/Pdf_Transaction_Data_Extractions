import express from "express";
import dbConnect from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();

app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173",  // Match React dev server
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true  // Optional: if you're using cookies/sessions
}));

// Serve static files (PDFs) with correct headers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath).toLowerCase() === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  },
}));

// Routes
app.use("/api", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});


// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv"

// dotenv.config();
// const PORT = 3000;
// const app = express();

// app.use(express.json()); // Parses application/json requests

// app.post("/translate", async (req, res) => {
//   // const { q, source = "hi", target = "en" } = req.body;

//   // if (!q) {
//   //   return res.status(400).json({ error: "Missing 'q' in request body" });
//   // }

//   try {
//     const response = await axios.post(
//       `https://translation.googleapis.com/language/translate/v2?key=${process.env.API_KEY}&q=Hello World&target=hi`
//     );

//     res.json({ translatedText: response.data.data.translations });
//   } catch (error) {
//     console.error("Translation error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to translate text" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
