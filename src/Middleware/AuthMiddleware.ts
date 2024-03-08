import { Request,Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

interface SignTokenRequest extends Request {
    body:{
        username: string,
        password: string
    }
} 



const signTokenMiddleware = async (req:SignTokenRequest, res: Response,next: NextFunction) => {
    try{
        const {username,password} = req.body;

        const user = new UserService
        user.authenticateUser(username, password);

        const payload = {
            userId: JSON.stringify(user).slice(1,-1),
            username: username
        }
        
        const token = jwt.sign(payload,"secret-key",{expiresIn: '1d'});

        res.header('Authorization', `Bearer ${token}`);

        next();
    }catch(e){
        console.error('Error signing JWT:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyToken = async (req: Request, res: Response,next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    jwt.verify(token, "secret-key", {}, (err, info) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid token' });
        }
        console.log("successfull token !!");
        
        next();
    });
    
}

export  {
    signTokenMiddleware,
    verifyToken
};