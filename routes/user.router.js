const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authmiddlewareVerification = require('../middleware/authMiddleware');

userRouter.post('/signup',userController.SignUp);
userRouter.post('/login',userController.login);
userRouter.delete('/deleteUser/:ID',userController.deleteUser);
//authenticated Routes
userRouter.get('/profile', authmiddlewareVerification, userController.UserProfile)
module.exports = userRouter;