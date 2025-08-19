import express from "express";
import {
  registerRecruiter,
  loginRecruiter,
  postJob,
  viewJobs,
} from "../controllers/recruiterController.js";

const router = express.Router();

// Recruiter Registration
router.post("/register", registerRecruiter);

// Recruiter Login
router.post("/login", loginRecruiter);

// Post a new job
router.post("/job", postJob);

// View all jobs posted by recruiter
router.get("/jobs/:recruiterId", viewJobs);

export default router;
