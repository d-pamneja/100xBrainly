import { Request,Response,NextFunction } from "express";
import dotenv from 'dotenv'; 
dotenv.config()

const aiMindURL = process.env.AI_MIND_URL

export const sendDocQuery = async (req:Request, res:Response) : Promise<any> =>{
    try{
        const requestBody = req.body

        if(requestBody){
            const user_query = requestBody.user_query
            const userID = requestBody.userID
            const key = requestBody.key
            
            const response = await fetch(`${aiMindURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ 
                    user_query: user_query,
                    userID: userID,
                    key: key,
                }),
            })

            if(response){
                const output = await response.json();
                return res.status(200).json({message : "Output from AI Mind fetched successfully", output})
            }
            else{
                return res.status(400).json({message : "Could not generate output from AI Mind"})
            }
        }
        else{
            res.status(400).json({message : "Document details missing"})
        }
    }
    catch(error : any){
        res.status(500).json({message : `Error in fetching answer from AI Mind ${error.message}`})
    }
}

export default {sendDocQuery}