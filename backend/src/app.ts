import express from 'express'
import {config} from "dotenv";
import appRouter from './routes';
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from 'passport'
import './middlewares/passport'
import morgan from "morgan"
import cors from "cors";

import dotenv from 'dotenv'; 
dotenv.config()

// App Initialisation
config();
const app = express()


// Middlewares
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize())
app.use(passport.session()) 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/',appRouter)

// Export the app
export default app