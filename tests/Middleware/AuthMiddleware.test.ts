import { signTokenMiddleware } from '../../src/Middleware/AuthMiddleware';
import { authenticateUser } from '../../src/Services/userService';
import jwt from 'jsonwebtoken';

jest.mock('../../src/Services/userService', () => ({
    authenticateUser: jest.fn((username, password) => ({
        userId: 'user123',
        username: username,
    })),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mocked-token'),
}));

describe('signTokenMiddleware', () => {
    let req: any; 
    let res: any; 
    let next: jest.Mock; 

    beforeEach(() => {
        req = {
            body: { username: 'testuser', password: 'testpassword' },
        };
        res = {
            header: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should set Authorization header with JWT token and call next', async () => {
        
        await signTokenMiddleware(req, res, next);

        expect(authenticateUser).toHaveBeenCalledWith('testuser', 'testpassword');

        expect(res.header).toHaveBeenCalledWith('Authorization', 'Bearer mocked-token');

        expect(next).toHaveBeenCalled();
    });

    test('should return 500 status and internal server error message if an error occurs', async () => {

        (authenticateUser as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Authentication failed');
        });

        await signTokenMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });

        expect(next).not.toHaveBeenCalled();
    });
});
