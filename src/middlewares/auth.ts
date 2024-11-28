import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
import { COOKIE_NAME } from '../utils/constants';

export const auth =  (
    req : Request, 
    res : Response, 
    next : NextFunction
) =>{
    try{
        const requestAuthorization = req.signedCookies[`${COOKIE_NAME}`];
        const decodedInfo = jwt.verify(requestAuthorization as any,JWT_SECRET as any)

        if(!decodedInfo){
            return res.status(401).json({message:"Incorrect Authentication"})
        }
        else{
            // @ts-ignore 
            // The above comment effectively ignores the potential error typescript is trying to warn us about
            res.locals.jwtData = decodedInfo.Id
            return next();
        }
    }
    catch(error : any){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
    }
}

export default {auth}