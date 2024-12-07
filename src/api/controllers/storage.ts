import { Request,Response,NextFunction } from "express";
import { S3Client,GetObjectCommand, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'; 
dotenv.config()
const aiMindURL = process.env.AI_MIND_URL

const s3Client = new S3Client({
    region : 'ap-south-1',
    credentials : {
        accessKeyId : process.env.AWS_ACCESS_KEY!,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY!,
    }
})

const BUCKET_NAME = '100xbrainly'

const checkObjectExistence = async (key: string): Promise<boolean> => { // Function to check whether it points to a correct object or not, using the HeadObjectCommand. This will give header of the command without returning the object
    try {
        const checkCommand = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        });
    
        await s3Client.send(checkCommand);
        return true;
    } catch (error: any) {
        if (error.name === "NotFound") {
            return false;
        }
        throw new Error(`Error checking object existence: ${error.message}`);
    }
};

export const getObject = async (req : Request, res: Response) : Promise<any> => {
    try {
        const key = req.query.key as string
        if(await checkObjectExistence(key)){
            const command = new GetObjectCommand({
                Bucket : BUCKET_NAME,
                Key : key
            })
            
            const url = await getSignedUrl(s3Client,command,{expiresIn : 3600})
    
            if(!url){
                return res.status(400).json({message : "Error in generating the signed URL for requested data"})
            }
    
            return res.status(200).json({message : "Successfully generated the signed URL for requested data",url})
        }
        else{
            return res.status(404).json({message : "Object does not exist in given location"})
        }
    } catch (error : any) {
        res.status(500).json({message : `Error in getting object : ${error.message}`})
    }
}

const ensureFolderExists = async (folderPath: string): Promise<void> => {
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    const createFolderCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: normalizedPath,
    });

    try {
        await s3Client.send(createFolderCommand);
    } catch (error: any) {
        throw new Error(`Error creating folder: ${error.message}`);
    }
};

export const setObject = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userID, type, filename,contentType,fileObject } = req.body;
        
        const fullPath = `${userID}/${type}/${filename}`;

        const userFolder = `${userID}/`;
        const typeFolder = `${userID}/${type}/`;

        if (!await checkObjectExistence(userFolder)) {
            await ensureFolderExists(userFolder);
        }

        if (!await checkObjectExistence(typeFolder)) {
            await ensureFolderExists(typeFolder);
        }

        const createObjectCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fullPath,
            ContentType: contentType
        });

        await s3Client.send(createObjectCommand)
        const url = await getSignedUrl(s3Client, createObjectCommand, { expiresIn: 3600 });

        if (!url) {
            return res.status(400).json({ 
                message: "Error generating signed URL for upload" 
            });
        }

        return res.status(200).json({ 
            message: "AWS upload done, signed URL for file set successfully", 
            url,
            fullPath
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ 
            message: `Error in setting object: ${error.message}` 
        });
    }
};

export const setObjectPinecone = async (req : Request, res: Response) : Promise<any> =>{
    try {
        const { file_url, type, key,userID } = req.body;
        
        const pineconeUpload = await fetch(`${aiMindURL}/storeDoc`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ 
                initial_query : {
                    "file_url" : file_url,
                    "file_type" : type
                },
                doc_info : {
                    "key" : key,
                    "userID" : userID,
                    "type" : type
                }
            }),
        })

        if(!pineconeUpload){
            res.status(400).json({message:"Pinecone upload not successfully executed"})
        }

        const output = await pineconeUpload.json();

        return res.status(200).json({ 
            message: "Pinecone upload of document done", 
            output
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ 
            message: `Error in setting object in pinecone: ${error.message}` 
        });
    }
}

export const removeObject = async (req : Request, res: Response) : Promise<any> => {
    try {
        const key = req.query.key as string
        if(await checkObjectExistence(key)){
            const command = new DeleteObjectCommand({
                Bucket : BUCKET_NAME,
                Key : key
            })

            await s3Client.send(command);

            return res.status(200).json({message : "Successfully deleted the requested data"})
        }
        else{
            return res.status(404).json({message : "Object does not exist in given location"})
        }
    } catch (error : any) {
        res.status(500).json({message : `Error in deleting object : ${error.message}`})
    }
}

export const removeObjectPinecone = async (req : Request, res: Response) : Promise<any> =>{
    try {
        const key = req.query.key as string
        
        const pineconeDeletion = await fetch(`${aiMindURL}/deleteDoc`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ 
                    "key" : key,
            }),
        })

        if(!pineconeDeletion){
            res.status(400).json({message:"Pinecone upload not successfully executed"})
        }

        const output = await pineconeDeletion.json();

        return res.status(200).json({ 
            message: "Pinecone deletion of document done", 
            output
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ 
            message: `Error in deleting object in pinecone: ${error.message}` 
        });
    }
}


export default {getObject,setObject,setObjectPinecone,removeObject,removeObjectPinecone}