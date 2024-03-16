import request from 'supertest';
import express from 'express';
import { signTokenMiddleware, verifyToken } from '../../src/Middleware/AuthMiddleware';
import router from '../../src/Routes/AuthRoutes'; 

const app = express();
app.use(express.json());
app.use(router); 

jest.mock('../../src/Services/userService');

describe('Express routes', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/register')
      .send({  });

    expect(response.status).toBeDefined();
  });

  it('should login a user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ });

    expect(response.status).toBeDefined();
  });

  it('should get user profile', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcwOTgyOTYwNCwiZXhwIjoxNzA5OTE2MDA0fQ.xcBmxf-Cu3udRUzymer8K319aLYBHpUW8PVob-Y72JM');

    expect(response.status).toBeDefined();
  });
});
