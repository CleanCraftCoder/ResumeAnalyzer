import dotenv from "dotenv";
dotenv.config({path: "./.env"}); // Load environment variables from .env file
import express from "express";
import connectDB from "./db/index.js"; // Importing the database connection function// Load environment variables from .env file
import {app} from "./app.js"; // Importing the Express app
import path from "path";


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit the process if the connection fails
})

