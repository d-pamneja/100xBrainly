import express from 'express'
import {config} from "dotenv";
import appRouter from './routes';
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from 'passport'
import './middlewares/passport'
import cors from "cors";
import serverless from 'serverless-http';

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
app.use(cors({ origin: "https://100x-brainly.vercel.app", credentials: true }));
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/',appRouter)

module.exports.handler = serverless(app); 

// Export the app
export default app