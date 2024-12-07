import { Router } from "express";
import { auth } from "../middlewares/auth";
import { addContent, deleteContent, getAllTags, editContent,viewContent } from "../controllers/content";

const contentRouter = Router()

contentRouter.use(auth as any)
contentRouter.post('/addContent',addContent)
contentRouter.get('/getTags', getAllTags)
contentRouter.get('/viewContent',viewContent)
contentRouter.put('/updateContent',editContent)
contentRouter.delete('/deleteContent',deleteContent)

export default contentRouter