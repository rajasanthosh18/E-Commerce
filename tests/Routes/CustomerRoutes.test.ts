import request from 'supertest';
import express, { Request, Response } from 'express';
import router from '../../src/Routes/CustomerRoutes';
import { createCustomers, getCustomers, getOrderDetailByGSI } from '../../src/Controllers/CustomerController';
import { createCustomer, getOrderDetailsUsingGSI } from '../../src/Services/CustomerService';
import { verifyToken } from '../../src/Middleware/AuthMiddleware'; 
import app from '../../src';



jest.mock('../../src/Controllers/CustomerController')
jest.mock('../../src/Services/CustomerService')

app.use(express.json()); 
app.use('/', router); 

describe('Customer Routes', () => {

    const req = {
        body: {
            username: "rajasanthosh",
        },
        method: "GET",
    };
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
    } as unknown as Response;

    test('GET /customers should return status 200 ', async () => {
        
        (getCustomers as jest.Mock).mockResolvedValue("Success");

        const response = await request(app).get('/customers').send(req.body).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcxMDIxNzE0MywiZXhwIjoxNzEwMzAzNTQzfQ.Dk3_oAqzHmvq7xtQDbQKDDpLhkuaUdpFQq6EIg-QhLA'); 

        console.log(response.status);
        
        expect(response.status).toBe(200);

    });


    test('GET /customers should return status 400', async () =>{

        (getCustomers as jest.Mock).mockImplementation()
        
        const response = await request(app).get('/customers').send(req.body).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcxMDA0NTExNCwiZXhwIjoxNzEwMTMxNTE0fQ.39hy-J-EIVMWo-vMcCiYunZxVoGfzdaq0AZDt-HILfw'); 

        expect(response.status).toBe(400)
        

    })

    it('should return status 200 and a success message', async () => {
        const reqBody = {
            username: 'testUser1',
            email: 'test@example.com',
            method: "POST"
        };

        (createCustomers as jest.Mock).mockResolvedValue("Success");

        const response = await request(app).post('/customers').send(reqBody).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcxMDE1ODk2MiwiZXhwIjoxNzEwMjQ1MzYyfQ.pgUSO7E54KSlUKcu3K9VXrudyLxUVbu_kB7bC3VL6x4'); 

        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Customer created successfully' });
    });


    it('should return status 200 and a success message for get order detail by GSI', async () => {
        const reqBody = {
            username: 'testUser1',
            email: 'test@example.com'
        };
        
        (getOrderDetailByGSI as jest.Mock).mockResolvedValue("Success");

        const response =  await request(app).get('/orders/2/details').send(reqBody).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcxMDE1ODk2MiwiZXhwIjoxNzEwMjQ1MzYyfQ.pgUSO7E54KSlUKcu3K9VXrudyLxUVbu_kB7bC3VL6x4');

        expect(getOrderDetailByGSI).toHaveBeenCalledWith('ORDERS', '2', '2');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ message: 'Order details retrieved successfully' });
    });
    
});





app.get('/orders/:orderId/details', verifyToken, getOrderDetailByGSI);


describe('GET /orders/:orderId/details', () => {
    
    jest.mock('../../src/Services/CustomerService', () => ({
        getOrderDetailsUsingGSI: jest.fn().mockResolvedValue([{ }])
    }));

    jest.mock('../../src/Middleware/AuthMiddleware', () => ({
        verifyToken: jest.fn((req, res, next) => next())
    }));
  test('should return order details for a valid orderId', async () => {
    const orderId = '2'; 

    const response = await request(app)
      .get(`/orders/${orderId}/details`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcxMDIxNzE0MywiZXhwIjoxNzEwMzAzNTQzfQ.Dk3_oAqzHmvq7xtQDbQKDDpLhkuaUdpFQq6EIg-QhLA');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{  }]);
  });

  test('should return 500 for an invalid orderId', async () => {
    const orderId = '123'; 

    const response = await request(app)
      .get(`/orders/${orderId}/details`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIiLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImlhdCI6MTcxMDIxNzE0MywiZXhwIjoxNzEwMzAzNTQzfQ.Dk3_oAqzHmvq7xtQDbQKDDpLhkuaUdpFQq6EIg-QhLA');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Failed to retrieve order details using GSI' });
  });
});
