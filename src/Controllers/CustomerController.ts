import { Request, Response } from "express";
import { addItemToOrders, createCustomer, createOrderForCustomer, getCustomer, getOrderDetail, getOrderDetailsUsingGSI, updateCustomerOrderIndexes } from "../services/CustomerService";

export async function createCustomers (req: Request,res: Response) {
    try{        
        const {username, email} = req.body;
        const result = await createCustomer(username,email);        
        res.json("sucess")
    }catch(error){      
        res.json({"Message": error})
    }
}

export async function getCustomers (req: Request,res: Response) {
    try{        
        const {username} = req.body;
        const result = await getCustomer(username);
        const filteredItem: any [] = []        
        const filteredResponse = result?.map(item => {
            const filteredData = {
                "name": item.name,
                "email": item.email,
                "OrderId": item.OrderId,
                "Status": item.Status,
                "Numberitems": item.Numberitems,
                "CreatedAt": item.CreatedAt,
                "Amount": item.Amount
            };
            
            filteredItem.push(filteredData);
        });
        res.json({filteredItem})
    }catch(error){     
        console.log(error);
         
        res.json({"Message": error})
    }
}

export async function getOrderDetails(req: Request,res: Response){
    try{
        const orderId  = req.params.orderId
        const result = await getOrderDetail(orderId) 
        const filteredData = result?.Items?.map(item => ({
            name: item.name.S,
            email: item.email.S,
        }));
        res.json(filteredData)
    }catch(error){
        res.json(error);
    }
}

export async function addItemToOrder(req: Request, res: Response) {
    try{
        const orderId = req.params.orderId
        const {itemId,content,price} = req.body
        const result = await addItemToOrders(orderId,itemId,content,price)
        res.json("Successfull")
    }catch(error){
        res.json(error)
    }
}

export async function createOrderForCustomers(req: Request,res: Response) {
    try{
        const customerName = req.params.customerName
        const { orderId, amount,noOfItems} = req.body
        const date = new Date()
        const result = await createOrderForCustomer(customerName,orderId,date,amount,noOfItems);

        res.json(result)
    }catch(e){
        console.log(e);
        res.json(e)        
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
        res.json(orderDetails);
    } catch (error) {
        console.error('Error retrieving order details using GSI:', error);
        res.status(500).json({ error: 'Failed to retrieve order details using GSI' });
    }
}
