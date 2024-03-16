import express from 'express';
import { loginUser, profile, registerUsers } from '../Controllers/UserController';


const router = express.Router();



router.post('/register', async(req,res) => await registerUsers(req,res));
router.post('/login', async (req,res) => await loginUser(req,res)); 
router.get('/profile', async (req,res)=> await profile(req,res))

export default router;
