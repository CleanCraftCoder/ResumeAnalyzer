import express from "express";
const router = express.Router();



import userRoutes from "./userRoutes.js"; // Importing user routes
import recruiterRoutes from "./recruiterRoutes.js" // Importing job routes
import resumeRoutes from "./resumeRoutes.js"; // Importing resume routes

router.get("/",(req,res)=>{
    res.render("index.ejs", { title: "Smart Resume AI" });
});

router.use("/user",userRoutes);
router.use("/job",recruiterRoutes);
router.use("/resume",resumeRoutes);


export default router;