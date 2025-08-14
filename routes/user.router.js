const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authmiddlewareVerification = require('../middleware/authMiddleware');

userRouter.post('/signup',userController.SignUp);
userRouter.post('/login',userController.login);
userRouter.delete('/deleteUser/:ID',userController.deleteUser);
//authenticated Routes
userRouter.get('/app/profile', authmiddlewareVerification, userController.UserProfile)
userRouter.patch('/app/updateProfile', authmiddlewareVerification, userController.UpdateProfile)
module.exports = userRouter;