# PDF Transaction Data Extraction

## Project Overview

This project provides a complete solution for extracting transaction data from PDF documents. It consists of a backend API server and a frontend React dashboard application.

- The **backend** is a Node.js Express server that handles PDF uploads, parses transaction data from the PDFs using libraries like `pdf-parse` and `tesseract.js`, and stores the extracted data in a MongoDB database.
- The **frontend** is a React application built with Vite that allows users to upload PDF files, view extracted transaction data in a searchable and filterable table, and preview the uploaded PDFs.

## Live Links

- Frontend (Dashboard): [https://pdf-transaction-data-extractions.vercel.app/login](https://pdf-transaction-data-extractions.vercel.app/login)
- Backend (API): [https://pdf-transaction-data-extractions-2.onrender.com](https://pdf-transaction-data-extractions-2.onrender.com)

## Features

- Upload PDF documents containing transaction data.
- Extract and parse transaction details automatically.
- View extracted transactions in a user-friendly dashboard.
- Filter and search transactions by various fields.
- Preview uploaded PDF documents alongside transaction data.

## Project Structure

- `backend/`: Node.js Express backend API server.
- `frontend/`: React frontend application.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- MongoDB instance (local or cloud)

### Backend Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following environment variables:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   API_KEY=your_google_translation_api_key
   ```

   Replace `your_mongodb_connection_string` and `your_google_translation_api_key` with your actual values.

4. Start the backend server in development mode (with auto-reload):

   ```bash
   npm run dev
   ```

   Or start the server normally:

   ```bash
   npm start
   ```

5. The backend server will run on `http://localhost:5000` by default.

### Backend API Endpoints

- `POST /api/upload`: Upload a PDF file for transaction data extraction.
- `GET /api/transactions`: Retrieve extracted transactions with optional query filters.
- `GET /uploads/:filename`: Access uploaded PDF files.

### Frontend Setup

npm start
npm install
cd backend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

4. The frontend will be available at `http://localhost:5173` by default.

### Notes

- The frontend is configured to communicate with the backend API at `http://localhost:5000/api` during local development.
- Uploaded PDF files are served statically by the backend under the `/uploads` route.
- CORS is enabled on the backend to allow requests from the frontend development server.

## Usage

1. Open the frontend dashboard in your browser.
2. Use the file upload form to select and upload a PDF document containing transaction data.
3. After upload, the extracted transactions will be displayed in the table.
4. Use the search filters to narrow down transactions by plot number, registration date, document number, and other fields.
5. Preview the uploaded PDF alongside the transaction data.

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose, Multer, pdf-parse, tesseract.js
- Frontend: React, Vite, React Router, React PDF Viewer, Tailwind CSS

## Author

Shivam
