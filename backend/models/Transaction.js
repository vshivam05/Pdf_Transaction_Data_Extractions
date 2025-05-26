import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  documentNumber: String,
  executionDate: String,
  registrationDate: String,
  nature: String,
  buyerName: String,
  sellerName: String,
  considerationValue: String,
  marketValue: String,
  prNumber: String,
  propertyType: String,
  propertyExtent: String,
  village: String,
  surveyNumber: String,
  plotNumber: String,
  scheduleRemarks: String,
  documentRemarks: String,
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
