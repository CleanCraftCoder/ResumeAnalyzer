import express from "express";
import upload from "../config/multerConfig.js";
import {uploadResumeHandler, getAllResumesHandler, getResumeByIdHandler,analyzeResumeHandler} from "../controllers/resumeController.js";

const router = express.Router();

// POST /resume/upload — Upload a new resume
router.post("/upload", upload.single("resume"), uploadResumeHandler);

// GET /resume/ — List all resumes
router.get("/", getAllResumesHandler);

//get resume by id
router.get("/:filename",getResumeByIdHandler)

router.get("/analyzeResumeByPdfName/:filename",analyzeResumeHandler)




export default router;
