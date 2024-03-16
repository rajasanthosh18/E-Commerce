import { loginUser, registerUsers } from '../../src/Controllers/UserController';
import { NextFunction, Request,Response } from 'express';
import { authenticateUser, registerUser } from '../../src/Services/userService'; 
import User from '../../src/Models/User';
import { signTokenMiddleware } from '../../src/Middleware/AuthMiddleware';

jest.mock('../../src/Services/userService')
jest.mock('../../src/Middleware/AuthMiddleware',()=>({
    signTokenMiddleware: jest.fn()
}))

describe('registerUsers', () => {
    

    const req: Request = {
        body: { username: 'testuser', email: 'test@example.com', password: 'password' },
        method: 'POST',
    }as unknown as Request;

    const res = {
        json: jest.fn(),
        status: jest.fn(),
    } as unknown as Response;

    test('should return 201 and success message on successful registration', async () => {
        const newUser: User = { userId: '001', username: 'testuser', email: 'test@example.com', password: 'password' };

        (registerUser as jest.Mock).mockResolvedValueOnce("Success")

        await registerUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        
    });

    test('should return 500 and error message on registration failure', async () => {
        const errorMessage = 'Internal server error';

        (registerUser as jest.Mock).mockResolvedValueOnce("Already Have an Account")

        req.body = { username: 'testuser', email: 'test@example.com', password: 'password' };

        await registerUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

    });
    
});


describe("Login Users",()=> {
    const req: Request = {
        body: { username: 'testuser', email: 'test@example.com', password: 'password' },
        method: 'POST',
    }as unknown as Request;

    const res = {
        json: jest.fn(),
        status: jest.fn(),
    } as unknown as Response;

    it('should return 200 and login successful message on valid credentials', async () => {
        const req = {
            body: { username: 'testUser', password: 'testPassword' }
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        const mockUser = { id: '123', username: 'testUser' };
        (authenticateUser as jest.Mock).mockResolvedValueOnce(mockUser);

        await loginUser(req, res);
        console.log(res.status);
        
        expect(authenticateUser).toHaveBeenCalledWith('testUser', 'testPassword');
        expect(signTokenMiddleware).toHaveBeenCalledWith(req, res, expect.any(Function));
    })

    it('should return 401 and invalid credentials message on invalid credentials', async () => {
        const req = {
            body: { username: 'testUser', password: 'wrongPassword' }
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        (authenticateUser as jest.Mock).mockResolvedValueOnce(null);

        await loginUser(req, res);

        expect(authenticateUser).toHaveBeenCalledWith('testUser', 'wrongPassword');
        expect(res.status).toHaveBeenCalledWith(401);
    })
})
