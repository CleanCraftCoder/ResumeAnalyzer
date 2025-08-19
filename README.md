# ResumeAnalyzer

A lightweight Node.js service that analyzes resume PDFs and returns structured feedback: a quick summary, improvement suggestions, a numeric score, and suggested job roles.

> Repo: `CleanCraftCoder/ResumeAnalyzer`

---

## ✨ Features

* **PDF ingestion** using Multer + PDF parsing
* **AI-powered analysis** (OpenAI/compatible API)
* **Structured JSON output** designed for easy UI consumption
* **Scoring rubric** with configurable weights
* **Job-role suggestions** inferred from skills & experience

---

## 🧰 Tech Stack

* **Runtime:** Node.js (>= 18)
* **Server:** Express.js
* **View engine (optional):** EJS
* **Upload:** Multer
* **PDF Parsing:** pdf-parse (or pdfjs)
* **AI:** OpenAI-compatible SDK

> Note: The repository currently shows JavaScript and a small amount of EJS in the codebase.

---

## 📁 Project Structure

```
ResumeAnalyzer/
├─ src/
│  ├─ app.js               # Express app bootstrap
│  ├─ routes/
│  │  └─ analyze.route.js  # /api/analyze endpoints
│  ├─ controllers/
│  │  └─ analyze.controller.js
│  ├─ services/
│  │  ├─ pdf.service.js    # PDF text extraction
│  │  └─ ai.service.js     # LLM call & prompt
│  ├─ utils/
│  │  ├─ scorer.js         # scoring rubric
│  │  └─ response.js       # uniform ApiResponse
│  └─ middlewares/
│     └─ upload.js         # Multer config
├─ .env                     # environment variables (not committed)
├─ package.json
└─ README.md
```

*Your actual file names may differ slightly; this layout reflects a clean separation of concerns.*

---

## ⚙️ Setup

### Prerequisites

* **Node.js** v18 or newer
* **npm** v9+ (or **pnpm**/**yarn**)

### 1) Clone & Install

```bash
git clone https://github.com/CleanCraftCoder/ResumeAnalyzer.git
cd ResumeAnalyzer
npm install
```

### 2) Configure Environment

Create a `.env` file at the project root:

```bash
PORT=3000
# OpenAI or OpenRouter compatible
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini            # or gpt-4o / gpt-3.5-turbo etc.
OPENAI_MAX_TOKENS=800
OPENAI_TEMPERATURE=0.2
# (optional) safety/timeout
REQUEST_TIMEOUT_MS=60000
```

### 3) Run

```bash
# dev with auto-restart
npm run dev

# production
npm start
```

Server will listen on `http://localhost:${PORT}`.

---

## 🔌 API

### POST `/api/analyze`

Uploads a resume PDF and returns a structured analysis.

**Form Data**

* `resume` – *file* (PDF required)

**Response (JSON)**

```json
{
  "ok": true,
  "data": {
    "summary": "Concise, 3–5 sentence overview of candidate.",
    "improvements": [
      "Add quantifiable metrics for project impact",
      "Reduce objective statement; focus on keywords"
    ],
    "score": 78,
    "rubric": {
      "structure": 18,
      "skills": 22,
      "experience": 24,
      "keywords": 14
    },
    "suggestedRoles": [
      "Frontend Developer",
      "React Engineer"
    ],
    "extracted": {
      "yearsExperience": 2,
      "primaryStack": ["JavaScript", "React", "Node.js"]
    }
  }
}
```

**Errors**

```json
{ "ok": false, "error": "Avatar file is missing" }
```

> Error messages will vary; this project uses a uniform `ApiResponse` shape.

---

## 🧪 Example (cURL)

```bash
curl -X POST \
  -F "resume=@/path/to/resume.pdf" \
  http://localhost:3000/api/analyze
```

---

## 🧠 Prompting & Scoring (reference)

* Prompt template composes: candidate summary → strengths → improvement list → role suggestions → rubric-scored breakdown.
* Scoring rubric (0–100): structure (20), skills (25), experience (30), keywords (25). Adjust weights in `utils/scorer.js`.
* Model parameters tuned for concise, JSON-safe output. Implement a JSON schema validator to harden.

---

## 🔐 Security Notes

* Validate file type (`application/pdf`) and max size (e.g., 3–5 MB).
* Strip embedded scripts; never render raw PDF text in HTML without escaping.
* Store uploads in a non-public folder (or keep in-memory) and delete after processing.
* Rate limit by IP; add simple auth for hosted demos.

---

## 🚀 Deployment

* **Render/Fly/Heroku/Vercel** (server): set `PORT` and API keys in dashboard.
* Enable persistent storage only if you intentionally keep uploads.
* Add production logging (pino/winston) and request timeouts.

---

## 🧭 Roadmap

* [ ] Multi-page PDF concurrency improvements
* [ ] Job JD matching endpoint (`/api/match`)
* [ ] Export: annotated PDF & shareable summary link
* [ ] i18n (English → Hindi/others)
* [ ] OAuth login for saved analyses

---

## 🤝 Contributing

PRs welcome! Please open an issue to discuss larger changes. Follow conventional commits and include before/after snippets when altering output format.

---

## 📝 License

MIT

---

## 📸 Screenshots (optional)

Add screenshots/gifs of the upload flow and a sample response here.

```
![Upload](docs/upload.png)
![Result](docs/result.png)
```

---

## 🧩 Tips & Gotchas

* If you see `TypeError: Cannot read properties of undefined (reading 'path')`, ensure your Multer field name matches the route handler (`resume`).
* For larger PDFs, set `maxBuffer` for the PDF parser or chunk pages.
* If using OpenRouter, set `OPENAI_BASE_URL` and verify model IDs.

---

### Attribution

* PDF parsing via `pdf-parse`/`pdfjs`
* LLM calls via `openai` SDK or compatible client
