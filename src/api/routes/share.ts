import { Router } from "express";
import { auth } from "../middlewares/auth";
import { shareLink, viewLink,linkStatus } from "../controllers/sharing";

export const shareRouter = Router()

shareRouter.get('/linkStatus',auth as any,linkStatus)
shareRouter.post('/shareBrain',auth as any,shareLink)
shareRouter.get('/viewBrain/:username/:uid',viewLink)

export default shareRouter

