import {Router} from 'express'
import { auth } from '../middlewares/auth'
import { sendDocQuery } from '../controllers/query'

export const queryRouter = Router()

queryRouter.use(auth as any)
queryRouter.post('/document',sendDocQuery)

export default queryRouter