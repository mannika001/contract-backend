const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Contract = require("./models/contract");
const generateContract = require("./llm")
const app = express();
app.use(cors({
 origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Backend running");
});


app.post("/api/contract", async (req, res) => {
  try {
    const formData = req.body;
    const contract = await Contract.create({ ...formData, status: "pending" });

    res.json({ contractId: contract._id, status: "pending" });

    const prompt = `
You are an AI assistant that drafts legal contracts.
Contract Type: ${formData.contractType}
Party A: ${formData.Contractor}
Party B: ${formData.Signee}
Start Date: ${formData.startDate}
End Date: ${formData.endDate}
Purpose / Scope:
${formData.scope}
Additional Clauses (Optional):
${formData.extraClauses || "None provided"}
Tone: ${formData.tone}
`;
  
//   setTimeout(async () => {
      try {
        const draft = await generateContract(prompt);

        await Contract.findByIdAndUpdate(contract._id, {
          status: draft.success ? "done" : "error",
          content: draft.success ? draft.content : draft.error,
        });
      } catch (err) {
        console.error("Error in delayed generation:", err);
      }
    // }, 10000); 

  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/contract/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "Not found" });
    res.json({ status: contract.status, content: contract.content });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 8081
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("ENV TEST:", {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  mongo_url: process.env.mongo_url,
});
