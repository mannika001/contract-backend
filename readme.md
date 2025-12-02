# AI Contract Generator — Backend

This backend provides an API for generating legal contracts using an AI language model. It handles requests from the frontend, processes user input, interacts with the AI model, and returns a structured contract response.

---

## API Usage

### Generate Contract

**Endpoint:**  
`POST /api/contract`

**Request Body:**
{
"contractType": "nda",
"partyAName": "Company A",
"partyBName": "Company B",
"startDate": "2025-12-01",
"endDate": "2026-12-01",
"scope": "Description of contract scope",
"extraClauses": "Optional clauses",
"tone": "standard"
}


**Response:**
{
"contract": {
"content": "Generated legal contract text here..."
}
}


**Error Handling:**
- Returns `500` if the AI service fails.
- Returns clear error messages if required fields are missing.

---

## Getting Started

Follow these instructions to set up and run the backend locally.

### Prerequisites

- **Node.js & npm** — Required to run the backend server.
- **Environment Variables** — Create a `.env` file in the project root with the following variables:

HF_TOKEN=your_huggingface_api_key
PORT=5000


### Libraries / Dependencies

{
"axios": "^1.13.2",
"cors": "^2.8.5",
"dotenv": "^17.2.3",
"express": "^5.2.1",
"mongoose": "^9.0.0",
"nodemon": "^3.1.11",
"openai": "^6.9.1"
}


### Installing

Clone the repository and install dependencies:

git clone <your-repo-url>
cd contract-backend
npm install



### Start the server

npm start


The backend API will be available at:

http://localhost:5000

## Prompt
`
You are an AI assistant that drafts legal contracts.

Write a clear, legally correct, well-structured contract based on the following details:

Contract Type: ${contractType}
Party A: ${partyAName}
Party B: ${partyBName}
Start Date: ${startDate}
End Date: ${endDate}

Purpose / Scope:
${scope}

Additional Clauses (Optional):
${extraClauses || "None provided"}

Tone: ${tone}

Return only the complete contract text. Do not add any explanations or notes.
`
In this way prompt will have all the necessary details like party name, dates and scope of the contract.
we can change the prompt according to our need

## LLM Configuration

- **Model:** `meta-llama/Llama-3.2-3B-Instruct` (Hugging Face Inference API)
- **Endpoint:** `https://router.huggingface.co/v1`
- **Auth:** Hugging Face API token (`apiKey`)

### Setup steps

1. **Request access to the model repo**  
   Open the model page on Hugging Face and request/gain access.

2. **Create an access token**  
   - Go to **Settings → Access Tokens → New token**  
   - Give it **read** and **inference** permissions  
   - Store it as `HF_TOKEN` (or similar) in your `.env`

3. **Follow the integration snippet**  
   - On the model page, click **Use this model → Inference Providers**  
   - Copy the OpenAI‑compatible example (with `https://router.huggingface.co/v1` as base URL)  
   - Plug your token and model ID (`meta-llama/Llama-3.2-3B-Instruct`) into your backend code.

### Database

- **Database:** MongoDB
- **Collection:** `contracts`
- **Purpose:** Store form data.

Each successful `/api/contract` request is persisted as a document(form data) in the `contracts` collection, for example:


