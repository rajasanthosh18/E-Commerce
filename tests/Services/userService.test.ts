
import { client } from '../../src';
import { authenticateUser, registerUser } from '../../src/Services/userService';

jest.mock('../../src/index');

describe('UserService', () => {
  describe('registerUser', () => {
    test('should register user successfully', async () => {
      const user = {
        userId: '001',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      (client.send as jest.Mock).mockResolvedValueOnce({}); 

      const result = await registerUser(user);

      expect(result).toBe('Success');
    });

    test('should return "Already Have an Account" if user already exists', async () => {
      const user = {
        userId: '001',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      (client.send as jest.Mock).mockRejectedValueOnce(new Error('User already exists'));

      const result = await registerUser(user);

      expect(result).toBe('Already Have an Account');
    });
  });

  describe('authenticateUser', () => {
    test('should authenticate user successfully', async () => {
      const username = 'testuser';
      const password = 'password';

      const mockItem = {
        username: { S: 'testuser' },
        password: { S: 'password' },
        email: { S: 'test@example.com' },
        userId: { S: '001' },
      };

      (client.send as jest.Mock).mockResolvedValueOnce({ Item: mockItem });

      const result = await authenticateUser(username, password);

      expect(result).toEqual({ Item: mockItem });
    });

    test('should return null if user authentication fails', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      (client.send as jest.Mock).mockResolvedValueOnce({ Item: null });

      const result = await authenticateUser(username, password);

      expect(result).toBeNull();
    });
  });
});
