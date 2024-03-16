import { Request, Response } from 'express';

import {signTokenMiddleware, verifyToken} from '../Middleware/AuthMiddleware';
import User from '../Models/User';
import { authenticateUser, registerUser } from '../Services/userService';

interface LoginRequest extends Request{
    body: {
        username: string,
        password: string
    }
}

interface RegistrationRequest extends Request {
    body: {
        username: string,
        email: string,
        password: string
    }
}



export async function registerUsers (req: RegistrationRequest, res: Response)  {

        try {
            const { username, email, password } = req.body;
            const user: User = {
                userId: '001',
                username: username,
                email: email,
                password: password
            }
            const newUser = await registerUser(user);
            if("Already Have an Account" === newUser){
                throw new Error("Already Have an Account");
            } 
            
            res.status(201)
            res.json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(500)
            res.json({ message: 'Internal server error' });
        }
    };



export async function loginUser (req: LoginRequest, res: Response)  {
        try {
            const { username, password } = req.body;

            const user = await authenticateUser(username, password);

            if (!user) {    
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            await signTokenMiddleware(req,res,() => {
                res.status(200).json({ message: 'Login successful', user });
            })

        } catch (error) {
            res.status(500);
        }
    };

export async function profile (req: Request,res: Response)  {
        try{
            verifyToken(req,res,()=>{
                res.status(200).json({ message: 'valid credentials ' });
            })
        }catch(e){
            console.log(e);
            res.status(500).json( {message: 'Provide valid credentials'})
            
        }
       
    }


