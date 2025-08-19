import path from "path";
import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { OpenAI } from "openai";

// ✅ OpenRouter Configuration
const openai = new OpenAI({
  apiKey: "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", // ← Replace with your actual OpenRouter key
  baseURL: "https://openrouter.ai/api/v1", // ← Required for OpenRouter
});

// 📁 Upload Resume Handler
export const uploadResumeHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const resumePath = `/public/resumes/${req.file.filename}`;

    return res.status(200).json({
      message: "Resume uploaded successfully",
      filePath: resumePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload resume" });
  }
};

// 📄 Get All Resumes
export const getAllResumesHandler = async (req, res) => {
  try {
    const resumesDir = path.resolve("src/public/resumes");
    const files = fs.readdirSync(resumesDir);
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

    const resumes = pdfFiles.map((file) => ({
      filename: file,
      url: `/public/resumes/${file}`,
    }));

    return res.status(200).json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Error reading resumes:", error);
    res.status(500).json({ error: "Failed to read resumes" });
  }
};

// 📄 Get Resume By Filename
export const getResumeByIdHandler = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename.endsWith(".pdf")) {
      return res.status(400).json({ error: "Invalid resume filename" });
    }

    const filePath = path.resolve("src/public/resumes", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Resume not found" });
    }

    return res.status(200).json({
      filename,
      url: `/public/resumes/${filename}`,
    });
  } catch (error) {
    console.error("Error getting resume:", error);
    res.status(500).json({ error: "Server error retrieving resume" });
  }
};

// 🤖 Analyze Resume with OpenRouter (GPT-3.5)
// 🤖 Analyze Resume with GPT-3.5 using pdfjs-dist + Scoring + Job Matching
// 🤖 Analyze Resume with GPT + structured feedback
export const analyzeResumeHandler = async (req, res) => {
  const { filename } = req.params;

  try {
    if (!filename.endsWith(".pdf")) {
      return res.status(400).json({ error: "Filename must be a .pdf" });
    }

    const resumePath = path.resolve("src/public/resumes", filename);

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume file not found" });
    }

    const data = new Uint8Array(fs.readFileSync(resumePath));
    const pdf = await pdfjsLib.getDocument({
      data,
      standardFontDataUrl: path.join(process.cwd(), "node_modules/pdfjs-dist/standard_fonts/")
    }).promise;

    let resumeText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({ error: "Resume content is too short or unreadable." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach. Analyze resumes and return feedback as JSON containing: feedback.summary, feedback.areasForImprovement (array), score (0-100), and suggestedRoles (array)."
        },
        {
          role: "user",
          content: `Analyze the following resume and return structured JSON feedback:\n\n${resumeText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const raw = response.choices[0].message.content;

    // Extract JSON from markdown or plain text
    const match = raw.match(/```json([\s\S]*?)```|({[\s\S]*})/);
    const jsonString = match ? (match[1] || match[0]) : null;

    if (!jsonString) {
      return res.status(500).json({ error: "Failed to parse feedback from AI." });
    }

    const parsed = JSON.parse(jsonString);

    return res.status(200).json({
      message: "Resume analyzed successfully",
      feedback: parsed.feedback || {},
      score: parsed.score || null,
      suggestedRoles: parsed.suggestedRoles || []
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Server error while analyzing resume" });
  }
};
