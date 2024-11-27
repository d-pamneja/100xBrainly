// Importing Required Dependencies
import app from "./app.js";
import {connect} from "mongoose";


// Connecting the database and application
const PORT = process.env.PORT || 3000;
console.log("Running on port: ",PORT );

// connect to mongoDB (make sure you wait the call, as app should only run when the connection is made)
connect(process.env.MONGODB_URI!).then(() => {
        app.listen(PORT,()=>console.log("Server opened and connected to MongoDB."));
    }).catch(err=>console.log(err))