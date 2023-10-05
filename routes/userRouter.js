import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const userRouter = Router()

userRouter.post('/log-in', UserController.logIn)
userRouter.post('/log-out', UserController.logOut)
userRouter.post('/sign-in', UserController.createUser)
