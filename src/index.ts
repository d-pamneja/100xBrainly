import { connect } from "mongoose";
import app from "./app";

// Connect to MongoDB first
connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Server set and connected to MongoDB.");
  })
  .catch((err) => console.log("MongoDB connection error: ", err));


