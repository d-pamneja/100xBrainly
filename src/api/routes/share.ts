import { Router } from "express";
import { auth } from "../middlewares/auth";
import { shareLink, viewLink,linkStatus } from "../controllers/sharing";

export const shareRouter = Router()


shareRouter.get('/viewBrain/:username/:uid',viewLink)
shareRouter.use(auth as any)
shareRouter.get('/linkStatus',linkStatus)
shareRouter.post('/shareBrain',shareLink)

export default shareRouter

