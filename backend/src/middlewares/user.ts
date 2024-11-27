import { Request, Response, NextFunction } from 'express';
import z from 'zod'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const userSchema = z.object({
    username : z.string()
                .min(3,"The username should be a minimum of three characters")
                .max(10, "The username should be a maximum of 10 characters"),
    password : z.string()
                .min(8,"The password has to be a minimum of 8 characters")
                .max(20,"The password has to be a maximum of 20 characters")
                .refine((password) => /[A-Z]/.test(password), {message: "Required atleast one uppercase character"})
                .refine((password) => /[a-z]/.test(password), {message: "Required atleast one lowercase character"})
                .refine((password) => /[0-9]/.test(password), {message: "Required atleast one number"})
                .refine((password) => /[!@#$%^&*]/.test(password), {message: "Required atleast one special character"})

})

export const checkCredentials =  (req : Request, res : Response, next : NextFunction) => { 
    try{
        const requestBody = req.body
        if(requestBody && requestBody.username && requestBody.password){
            const validationResult = userSchema.safeParse(requestBody);

            if (!validationResult.success) {
                const errors = validationResult.error.issues
                let errorsArray = errors.map(error=>{
                    return error.message
                })


                return res.status(400).json({message: "Validation error(s)", details: errorsArray});
            }
            else{
                next()
            }
        }
        else{
            if(!requestBody){
                res.status(400).json({message:"Invalid request body"})
            }
            else if(!requestBody.username){
                res.status(411).json({message:"User name not found."})
            }
            else if(!requestBody.password){
                res.status(411).json({message:"Password not found."})
            }
        }
    }
    catch(error : any){
        return res.status(500).json({message:`Error at backend with error : ${error.message}`})
    }
}


export default {checkCredentials}