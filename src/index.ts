import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import express from 'express';
import routes from './Routes/CustomerRoutes'
const app = express()
app.use(express.json())

export const client = new DynamoDBClient({
    region: 'local',
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: 'i1jfhj',
        secretAccessKey: 'e5b3tm'
    }
})
// getOrder()


// accessOrderFromGSI(TableName,orderId);
//PutOrderItems(orderId.toString(), itemId.toString(),"content of items 2",40)
// GSIinitialize(TableName);
// putItem(TableName,CustomerName,CustomerName,email);
// updateItem(addresses);
// putOrderToCustomer(TableName,CustomerName,orderId,date);
// updateOrder();
// getOrdersOfCustomer(TableName,"raja")
// getOrders()

export default app