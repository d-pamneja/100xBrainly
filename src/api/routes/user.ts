import { Router } from "express";
import {checkCredentials}  from "../middlewares/user";
import {auth} from "../middlewares/auth";
import { signUp,login, logout,verifyUser } from "../controllers/user";

export const userRouter = Router()

// The as any syntax is called a type assertion and effectively turns off type checking for the specific parameter. Basically, we are calling this assertion as we will not pass the parameters for middlewares mannually
userRouter.post('/signup',checkCredentials as any,signUp) 
userRouter.post('/login',login)
userRouter.use(auth as any)
userRouter.get('/logout',logout)
userRouter.get('/auth-status',verifyUser) 

export default userRouter