const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
  {
    contractType: String,
    Contractor: String,
    Signee: String,
    startDate: String,
     endDate: String,
    scope: String,
    extraClauses: String,
    status: { type: String, default: "pending" },
     content: { type: String, default: "" },
    tone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", ContractSchema);
