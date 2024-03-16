import { Request, Response } from "express";
import { addItemToOrders, createCustomer, createOrderForCustomer, getCustomer, getOrderDetail, getOrderDetailsUsingGSI, updateCustomerOrderIndexes } from "../Services/CustomerService";
import { filteredData } from "../Middleware/CustomerMiddleware";

export async function createCustomers (req: Request,res: Response) {
    try{        
        const {username, email} = req.body;
        const result = await createCustomer(username,email);
        if(result === 'Already have an Account') throw new Error("Already have an Account");
        res.status(200)        
        res.json("Success")
    }catch(error){      
        res.status(400)
        res.json("Already have an Account")
    }
}

export async function getCustomers (req: Request,res: Response) {
    try{        
        const {username} = req.body;
        const result = await getCustomer(username);  
        
        if ( result == 'No Customer Details') {
            
            throw new Error("NO Customer Details");
        }
        res.status(200)
        res.json(result)
    }catch(error){     
        console.log(error);
        res.status(400)
        res.json("Error")
    }
}

export async function getOrderDetails(req: Request,res: Response){
    try{
        const orderId  = req.params.orderId
        const result = await getOrderDetail(orderId) 
        
        res.status(200).json(result)
    }catch(error){
        res.status(401).json(error);
    }
}

export async function addItemToOrder(req: Request, res: Response) {
    try{
        const orderId = req.params.orderId
        const {itemId,content,price} = req.body
        const result = await addItemToOrders(orderId,itemId,content,price)
        res.json("Successfull")
        res.status(200)
    }catch(error){
        res.status(500)
        res.json("Error")
    }
}

export async function createOrderForCustomers(req: Request,res: Response) {
    try{
        const customerName = req.params.customerName
        const { orderId, amount,noOfItems} = req.body
        const date = new Date()
        const result = await createOrderForCustomer(customerName,orderId,date,amount,noOfItems);

        res.status(200).json(result)
    }catch(e){

        res.status(500).json(new Error('Internal server error'))        
    }
}

export async function updateCustomerOrderIndexe(req: Request,res: Response) {
    try{
        const orderId = req.params.orderId
        const { username } = req.body
        const result = await updateCustomerOrderIndexes(username, orderId)
        res.json(result)
    }catch(e){
        res.json(e);
    }
}

export async function getOrderDetailByGSI(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
        const orderDetails = await getOrderDetailsUsingGSI(orderId);  
        res.status(200).json(orderDetails)
    } catch (error) {
        console.error('Error retrieving order details using GSI:', error);
        res.status(500).json({ error: 'Failed to retrieve order details using GSI' });
    }
}
