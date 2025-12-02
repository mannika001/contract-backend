const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Contract = require("./models/contract");
const generateContract = require("./llm")
const app = express();
app.use(cors());
app.use(express.json());

connectDB();


// bridge between the UI and the LLM.

app.post("/api/contract", async (req, res) => {
    try {
        const formData = req.body
        const contract = await Contract.create(req.body);
        console.log("formData", formData)
        if (contract) {
            const prompt = `
You are an AI assistant that drafts legal contracts.

Write a clear, legally correct, well-structured contract based on the following details:

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

Requirements:

Use appropriate legal headings and numbered clauses.

Make the contract specific to the details provided.

Ensure the language is professional and precise.

If some information is missing, make reasonable neutral assumptions instead of asking questions.

Return only the full contract text. Do not include explanations, notes, or surrounding quotes.
`;


            const draft = await generateContract(prompt);

            res.json({ contract: draft });

        }
        // res.json({
        //   message: "Form data stored successfully",
        //   savedContract: contract
        // });

    } catch (error) {
        console.error("Error storing data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
