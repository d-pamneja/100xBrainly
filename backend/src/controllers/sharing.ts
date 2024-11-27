import { Request,Response,NextFunction } from "express";
import { ContentModel, LinkModel, UserModel } from "../db/model";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export const linkStatus = async (req : Request, res: Response) : Promise<any> => {
    try{
            // @ts-ignore
            const userID = new mongoose.Types.ObjectId(`${res.locals.jwtData}`)

            const linkCheck = await LinkModel.find({
                userID : userID
            })

            return res.status(200).json({message : `Sharing link status for ${userID} fetched `,linkStatus : linkCheck[0] ? true : false,linkCheck})        
    }
    catch(error : any){
        res.status(500).json({message : `Error in sharing dashboard ${error.message}`})
    }
}

export const shareLink = async (req : Request, res: Response) : Promise<any> => {
    try{
        const requestBody = req.body

        if(requestBody){
            const setting = requestBody.share
            if(setting===true){
                // @ts-ignore
                const userID = new mongoose.Types.ObjectId(`${res.locals.jwtData}`)

                const user = await UserModel.findById(userID)
                if(!user){
                    res.status(404).json({message : "User not found."})
                }
                const username = user?.username?.replace(/\s+/g, '') || ''; // Remove all spaces just in case it gives display name (google auth user)

                const shareToken = jwt.sign({ 
                    userID : userID,
                    share : setting
                },JWT_SECRET as any)

            
                const encodedToken = Buffer.from(shareToken).toString('base64url'); // URL-safe encoding 
                const link = `http://localhost:5173/share/viewBrain/${username}/${encodedToken}`;

                
                await LinkModel.create({
                    hash : link,
                    userID : userID
                })

                return res.status(201).json({message : `Sharable link activated for the brain of user ${username}`,link})
            }
            else{ // Delete if they toggle off the share button
                // @ts-ignore
                const userID = new mongoose.Types.ObjectId(`${res.locals.jwtData}`)
                const user = await UserModel.findById(userID)
                if(!user){
                    res.status(404).json({message : "User not found."})
                }
                const username = user?.username?.replace(/\s+/g, '') || ''; // Remove all spaces just in case it gives display name (google auth user)


                await LinkModel.deleteOne({
                    userID : userID
                })

                res.status(200).json({message:`Sharable link de-activated for the brain of user ${username}`})
            }
        }
        else{
            return res.status(404).json({message:"Details to share not found."})
        }
    }
    catch(error : any){
        res.status(500).json({message : `Error in sharing dashboard ${error.message}`})
    }
}

export const viewLink = async (req : Request, res: Response) : Promise<any> => {
    try{
        const shareToken = Buffer.from(req.params.uid, 'base64url').toString('utf-8');
        const decodedLink = jwt.verify(shareToken as any,JWT_SECRET as any)

        if(decodedLink){
            // @ts-ignore 
            const ID = decodedLink.userID
            const requestUserID = new mongoose.Types.ObjectId(`${ID}`)
            // @ts-ignore 
            const linkAccess = decodedLink.share

            const LinkResponse = await LinkModel.findOne({
                userID : requestUserID
            })

            if(LinkResponse){
                const contentResponse = await ContentModel.find({
                    // @ts-ignore 
                    userID : requestUserID
                })
                if(contentResponse){
                    res.status(200).json({message : "Access to this brain has been granted.",contentResponse,LinkResponse})
                }
            }
            else{
                res.status(403).json({message : "Access to this brain has been denied."})
            }
        }
        else{
            return res.status(404).json({message:"Invalid share link."})
        }
    }
    catch(error : any){
        res.status(500).json({message : `Error in adding new content ${error.message}`})
    }
}

export default {shareLink,viewLink}