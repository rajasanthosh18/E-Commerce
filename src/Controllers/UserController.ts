import { Request, Response } from 'express';
import { UserService } from '../services/userService';

import {signTokenMiddleware, verifyToken} from '../Middleware/authMiddleware';
import User from '../Models/user';

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

export class AuthController {
    constructor(private userService: UserService) {}

    public registerUser = async (req: RegistrationRequest, res: Response) => {

        try {
            
            const { username, email, password } = req.body;
            const user: User = {
                userId: '001',
                username: username,
                email: email,
                password: password
            }
            const newUser = await this.userService.registerUser(user);
            console.log(newUser);
            
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };



    public loginUser = async (req: LoginRequest, res: Response) => {
        try {
            const { username, password } = req.body;

            const user = await this.userService.authenticateUser(username, password);

            if (!user) {    
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // console.log(user.Item);      
            
            signTokenMiddleware(req,res,() => {
                res.status(200).json({ message: 'Login successful', user });
            })

        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    public profile = async (req: Request,res: Response) => {
        try{
            verifyToken(req,res,()=>{
                res.status(200).json({ message: 'valid credentials ' });
            })
        }catch(e){
            console.log(e);
            res.status(500).json( {message: 'Provide valid credentials'})
            
        }
       
    }
}

export default new AuthController(new UserService());

