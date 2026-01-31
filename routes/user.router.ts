import express from 'express';
import * as userController from '../controllers/userController.js';
import authmiddlewareVerification from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup', userController.SignUp);
userRouter.post('/login', userController.login);
userRouter.delete('/deleteUser/:ID', userController.deleteUser);
//authenticated Routes
userRouter.get('/app/profile', authmiddlewareVerification, userController.UserProfile);
userRouter.patch('/app/updateProfile', authmiddlewareVerification, userController.UpdateProfile);
userRouter.delete('/app/profile', authmiddlewareVerification, userController.deleteUserData);

export default userRouter;