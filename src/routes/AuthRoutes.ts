import express from 'express';
import { AuthController } from '../Controllers/UserController';
import { UserService } from '../services/userService';
import {signTokenMiddleware,verifyToken} from '../Middleware/AuthMiddleware';


const router = express.Router();
const authController = new AuthController(new UserService);

router.post('/register', authController.registerUser);
router.post('/login', signTokenMiddleware, authController.loginUser); 
router.get('/profile',verifyToken,authController.profile)

export default router;
