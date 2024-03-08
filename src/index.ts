import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import GSIinitialize from './services/initializeOfGSI';
import express from 'express';
import routes from './routes/CustomerRoutes';
import authRoutes from './routes/AuthRoutes';

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
app.use('/auth',authRoutes)

app.use('/',routes)




// accessOrderFromGSI(TableName,orderId);
//PutOrderItems(orderId.toString(), itemId.toString(),"content of items 2",40)
// GSIinitialize(TableName);
// putItem(TableName,CustomerName,CustomerName,email);
// updateItem(addresses);
// putOrderToCustomer(TableName,CustomerName,orderId,date);
// updateOrder();
// getOrdersOfCustomer(TableName,"raja")
// getOrders()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});