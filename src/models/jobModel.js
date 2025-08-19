import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Job", jobSchema);
