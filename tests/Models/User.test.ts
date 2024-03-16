import User from '../../src/Models/User';

describe('User interface', () => {
    test('should have the correct properties', () => {
        const sampleUser: User = {
            userId: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password'
        };

        expect(sampleUser).toHaveProperty('userId');
        expect(sampleUser).toHaveProperty('username');
        expect(sampleUser).toHaveProperty('email');
        expect(sampleUser).toHaveProperty('password');
    });
});
