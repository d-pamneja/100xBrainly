import { connect } from "mongoose";
import dotenv from 'dotenv'; 
import app from "./app";
dotenv.config()

// Connect to MongoDB first
connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Server set and connected to MongoDB.");
  })
  .catch((err) => console.log("MongoDB connection error: ", err));



module.exports.handler = app