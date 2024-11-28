import express from 'express'
import {config} from "dotenv";
import appRouter from './api/routes';
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from 'passport'
import './api/middlewares/passport'
import cors from "cors";
import serverless from 'serverless-http';
import {connect} from "mongoose";

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

module.exports = serverless(app)
export default app;