import { Router } from "express";
import { auth } from "../middlewares/auth";
import { addContent, deleteContent, getAllTags, editContent,viewContent } from "../controllers/content";

const contentRouter = Router()

contentRouter.post('/addContent',auth as any,addContent)
contentRouter.get('/getTags',auth as any, getAllTags)
contentRouter.get('/viewContent',auth as any,viewContent)
contentRouter.put('/updateContent',auth as any,editContent)
contentRouter.delete('/deleteContent',auth as any,deleteContent)

export default contentRouter