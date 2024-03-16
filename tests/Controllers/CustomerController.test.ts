import { addItemToOrder, createCustomers, createOrderForCustomers, getCustomers, getOrderDetails, updateCustomerOrderIndexe } from "../../src/Controllers/CustomerController";
import { addItemToOrders, createCustomer, createOrderForCustomer, getCustomer, getOrderDetail, updateCustomerOrderIndexes } from "../../src/Services/CustomerService";

jest.mock("../../src/Middleware/CustomerMiddleware")
jest.mock('../../src/Services/CustomerService')

import { Request,Response } from "express";


describe("Customer Controller", () => {

    describe("Create Customer", ()=> {
        
        const req: Request = {
            body: {username: 'rajasanthosh',email: "test@gmail.com"},
            method: 'POST',
        }as Request;

        const res: Response = {
            json: jest.fn(), 
            status: jest.fn(),
            send: jest.fn(), 
        } as unknown as Response;

        test('should send status of 200 when customer creates', async () => {
            (createCustomer as jest.Mock).mockResolvedValueOnce('Success');
    
            await createCustomers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('Success');
        });
    
        test('should send status of 400 when customer exists', async () => {
            (createCustomer as jest.Mock).mockResolvedValueOnce('Already have an Account');
    
            await createCustomers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('Already have an Account');
        });

    })
    
    describe("Fetch Customer Details",()=>{

        const req: Request = {
            body: { username: 'rajasanthosh' },
            method: 'GET',
        } as Request;
        
        const res: Response = {
            json: jest.fn(), 
            status: jest.fn(),
            send: jest.fn(), 
        } as unknown as Response;

        test("should return data of customer with order details",async ()=>{

            (getCustomer as jest.Mock).mockResolvedValueOnce({
                "filteredItem": [
                    {
                        "name": {
                            "S": "rajasanthosh"
                        },
                        "email": {
                            "S": "rajasanthosh@sample.com"
                        }
                    }
                ]
            })

            await getCustomers(req,res);

            expect(res.status).toHaveBeenCalledWith(200)
        })

        test("should return not having account", async () => {

            (getCustomer as jest.Mock).mockResolvedValueOnce('No Customer Details')

            await getCustomers(req,res);

            expect(res.status).toHaveBeenCalledWith(400)
        })
    })

    describe("Add Item to Order Controller", () => {
        test('should send status of 200 when item is added successfully', async () => {
            const req: Request = {
                params: { orderId: '123' },
                body: { itemId: '456', content: 'Test item', price: 20 }
            } as unknown as Request;
    
            const res: Response = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;
    
            (addItemToOrders as jest.Mock).mockResolvedValueOnce('Success');
    
            await addItemToOrder(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('Successfull');
        });
    
        test('should send status of 500 when an error occurs', async () => {
            const req: Request = {
                params: { orderId: '123' },
                body: { itemId: '456', content: 'Test item', price: 20 }
            } as unknown as Request;
    
            const res: Response = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;
    
            (addItemToOrders as jest.Mock).mockRejectedValueOnce('Error');
    
            await addItemToOrder(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Error');
        });
    });

    describe('getOrderDetails', () => {
        let req: Request;
        let res: Response;
        
        beforeEach(() => {
            req = {
                params: { orderId: '2' }
            } as unknown as Request;
    
            res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            } as unknown as Response;
        });
    
        test('should return order details if found', async () => {
            const mockOrderDetails = {
                Items: [
                    { name: { S: 'Test Name' }, email: { S: 'test@example.com' } }
                ]
            };
    
            (getOrderDetail as jest.Mock).mockResolvedValueOnce(mockOrderDetails);
    
            await getOrderDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(200)
            
        });
    
        test('should return error message if an error occurs', async () => {
            const errorMessage = 'Internal server error';
            (getOrderDetail as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
            await getOrderDetails(req, res);
    
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe('createOrderForCustomers', () => {
        let req: Request;
        let res: Response;
    
        beforeEach(() => {
            req = {
                params: { customerName: 'testCustomer' },
                body: { orderId: 'testOrderId', amount: 100, noOfItems: 2 }
            } as unknown as Request;
    
            res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            } as unknown as Response;
        });
    
        test('should create order for customer and return result', async () => {
            const mockResult = { orderId: 'testOrderId', message: 'Order created successfully' };
            (createOrderForCustomer as jest.Mock).mockResolvedValueOnce(mockResult);
    
            await createOrderForCustomers(req, res);
    
            expect(createOrderForCustomer).toHaveBeenCalledWith(
                'testCustomer',
                'testOrderId',
                expect.any(Date),
                100,
                2
            );
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });
    
        test('should return error message if an error occurs', async () => {
            const errorMessage = 'Internal server error';
            (createOrderForCustomer as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
            await createOrderForCustomers(req, res);
    
            expect(createOrderForCustomer).toHaveBeenCalledWith(
                'testCustomer',
                'testOrderId',
                expect.any(Date),
                100,
                2
            );
            expect(res.status).toHaveBeenCalledWith(500)
        });
    });

    describe('updateCustomerOrderIndexe', () => {

        it('should return the result of updating customer order indexes', async () => {
            const req = {
                params: { orderId: '123' },
                body: { username: 'testUser' }
            } as unknown as Request;
            const res = {
                json: jest.fn()
            } as unknown as Response;
            const mockResult = { success: true };
            (updateCustomerOrderIndexes as jest.Mock).mockResolvedValueOnce(mockResult);
    
            await updateCustomerOrderIndexe(req, res);
    
            expect(updateCustomerOrderIndexes).toHaveBeenCalledWith('testUser', '123');
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return the error response if an error occurs', async () => {
            const req = {
                params: { orderId: '123' },
                body: { username: 'testUser' }
            }as unknown as Request;
            const res = {
                json: jest.fn()
            } as unknown as Response;
            const mockError = new Error('Internal server error');
            (updateCustomerOrderIndexes as jest.Mock).mockRejectedValueOnce(mockError);
    
            await updateCustomerOrderIndexe(req, res);
    
            expect(updateCustomerOrderIndexes).toHaveBeenCalledWith('testUser', '123');
            expect(res.json).toHaveBeenCalledWith(mockError);
        });

    })

});

