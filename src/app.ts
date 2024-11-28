import express from 'express'
import {config} from "dotenv";
import appRouter from './api/routes';
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from 'passport'
import './api/middlewares/passport'
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
app.use(cors({
    origin : true,
    credentials: true
  }));
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/',appRouter)


export default app;