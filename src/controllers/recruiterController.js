import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jobModel from "../models/jobModel.js";

// Register recruiter (user with role = 'recruiter')
export const registerRecruiter = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const recruiter = await userModel.create({
      name,
      email,
      password: hashed,
      role: "recruiter", // <-- mark as recruiter
    });

    res.status(201).send("Recruiter registered successfully");
  } catch (err) {
    res.status(500).send("Error registering recruiter");
  }
};

// Login recruiter
export const loginRecruiter = async (req, res) => {
  const { email, password } = req.body;

  try {
    const recruiter = await userModel.findOne({ email, role: "recruiter" });
    if (!recruiter) return res.status(404).send("Recruiter not found");

    const match = await bcrypt.compare(password, recruiter.password);
    if (!match) return res.status(400).send("Invalid credentials");

    res.status(200).send("Login successful");
  } catch (err) {
    res.status(500).send("Login failed");
  }
};

// Post a job
export const postJob = async (req, res) => {
  const { title, description, company, location, postedBy } = req.body;

  try {
    const job = await jobModel.create({
      title,
      description,
      company,
      location,
      postedBy, // recruiter _id
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).send("Job posting failed");
  }
};

// View jobs posted by recruiter
export const viewJobs = async (req, res) => {
  const { recruiterId } = req.params;

  try {
    const jobs = await jobModel.find({ postedBy: recruiterId });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).send("Failed to fetch jobs");
  }
};
