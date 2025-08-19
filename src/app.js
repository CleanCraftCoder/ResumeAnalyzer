import express from 'express';
import cors from 'cors';
import appRoute from './routes/appRoute.js'; // Central router
import path from 'path';
import { fileURLToPath } from 'url';

import fs from "fs";
const uploadDir = "public/resumes";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set EJS as the view engine
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); // ✅ Correct path


app.use('/resumes', express.static(path.join(__dirname, 'public/resumes')));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

const publicPath = path.join(process.cwd(), "src", "public");
app.use("/public", express.static(publicPath));

app.use("/public", express.static(path.resolve("src/public")));

// 👇 Use central router that handles /user, /job, /resume
app.use("/", appRoute);

export { app };
