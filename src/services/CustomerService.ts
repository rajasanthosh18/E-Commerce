import { PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, QueryInput, TransactWriteItemsCommand, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { client } from "../index";

const TableName = 'e-store'

export async function getOrderDetail(OrderId: string) {
    const params: QueryCommandInput = {
        TableName: TableName,
        IndexName: 'GSI1',
        KeyConditionExpression: '#GSI1PK = :o',
        ExpressionAttributeNames: {
            '#GSI1PK': 'GSI1PK'
        },
        ExpressionAttributeValues:{
            ':o': {'S': 'ORDER#' + OrderId.toString()}
        }
    }

    try {
        const res = await client.send(new QueryCommand(params));
        console.log("Retrieved order details from GSI:", res.Items);
        return res;
    } catch (error) {
        console.log("Error accessing order details from GSI:", error);    
    }
}



export async function getCustomer( CustomerName: string) {
    const command = new QueryCommand( {
        TableName: TableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames:{
            '#pk' : 'PK'
        },
        ExpressionAttributeValues:{
            ":pk" : {'S': 'CUSTOMER#'+CustomerName}
        },
        ScanIndexForward: false,
        Limit: 11
    })

    try{
        const res = await client.send(command);
        
        return res.Items;
    }catch(E){
        console.log("Error : ",E);
    }
}

export async function createCustomer(username:string,email:string) {
    
    try{
        const transactWriteItem = new TransactWriteItemsCommand ({
            TransactItems:[
                {
                    Put: {
                        TableName: TableName,
                        Item:{
                            'PK': { 'S': 'CUSTOMER#'+username },
                            'SK': { 'S': 'CUSTOMER#'+username },
                            'username': { 'S': username },
                            'name': { 'S': username },
                        },
                        ConditionExpression: 'attribute_not_exists(PK)'
                    }
                },
                {
                    Put: {
                        TableName: TableName,
                        Item:{
                            'PK': { 'S': 'CUSTOMEREMAIL#'+email },
                            'SK': { 'S': 'CUSTOMEREMAIL#'+email },
                        },
                        ConditionExpression: 'attribute_not_exists(PK)'
                    }
                }
            ]
        }) 
        
        const res =  await client.send(transactWriteItem);
        console.log("Transaction Completed !");
        return res
    }catch(e){
        console.log("Error in Create Customer :" ,e);
        return e;        
    }
}

export async function updateCustomerOrderIndexes(username:string,orderId: string) {
    const params: UpdateItemCommandInput = {
        TableName: TableName,
        Key:{
            'PK' : {'S':'CUSTOMER#'+username},
            'SK' : {'S':'CUSTOMER#'+username}
        },
        UpdateExpression: 'SET GSI1PK = :gsi1pk,GSI1SK = :gsi1sk',
        ExpressionAttributeValues:{
            ":gsi1pk" : {'S': "ORDER#"+orderId },
            ":gsi1sk" : {'S': 'ORDER#'+orderId }
        }
    }

    try{
        const res = await client.send(new UpdateItemCommand(params))
        console.log("Update an item");
        return res;
    }catch(error){
        console.log("Error ", error);
        return error
    }
}


export async function addItemToOrders (orderId: string, itemId: string,content: string,price: number){
    const command =  new PutItemCommand( {
        TableName: TableName,
        Item: {
            'PK' : {'S': 'ORDER#'+orderId+'#ITEM#'+itemId },
            'SK' : {'S': 'ORDER#'+orderId+'#ITEM#'+itemId},
            'OrderId': {'S': orderId},
            'ItemId': {'S': itemId},
            "Description": {'S': content},
            "Price": {'S': price.toString()}
        }
    })
    try{
        const res = await client.send(command)
        console.log("added sucessfully");
        return res
    }catch(E){
        console.log(E);   
    }
}

export async function createOrderForCustomer(customer: string,orderId: number,date: Date,amount: number,noOfItems: number) {
    const params: PutItemCommandInput = {
        TableName: TableName,
        Item:{
            'PK': {'S': 'CUSTOMER#'+customer},
            'SK': {'S': '#ORDER#'+orderId.toString()},
            'OrderId': {'S': ''+orderId.toString()},
            "CreatedAt": {'S': date.toString() },
            'Status' : {'S': 'Shipped'},
            "Amount" : {"S": "$"+amount},
            "Numberitems":{"S": noOfItems.toString()}
        }
    }
    try{
        const res = await client.send(new PutItemCommand(params));
        console.log("Successful order updated !!");
        return res;
    }catch(E){
        console.log("Error : ",E);   
    }
}

export async function getOrderDetailsUsingGSI(orderId: string) {
    const params: QueryCommandInput = {
        TableName: TableName,
        IndexName: 'GSI1', 
        KeyConditionExpression: 'GSI1PK = :orderId',
        ExpressionAttributeValues: {
            ':orderId': { 'S': `ORDER#${orderId}` }
        }
    };

    try {
        const res = await client.send(new QueryCommand(params));
        return res.Items;
    } catch (error) {
        throw error;
    }
}