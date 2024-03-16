import { PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, QueryInput, TransactWriteItemsCommand, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { client } from "../index";
import { filteredData } from "../Middleware/CustomerMiddleware";

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
        const filteredData = res?.Items?.map(item => ({
            name: item.name.S,
            email: item.email.S,
        }));
        if(filteredData?.length === 0) {
            throw new Error()
        }
        return filteredData;
    } catch (error) {
        console.log("Error accessing order details from GSI:", error);    
        return "Error"
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
        

        const result = await filteredData(res.Items);
        console.log(result);
        
        return result;
    }catch(E){
        console.log();
        
        return 'No Customer Details';
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
        return "Success"
    }catch(e){
        console.log("Error in Create Customer :" ,e);
        return 'Already have an Account';        
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
        await client.send(command)
        console.log("added sucessfully");
        return "added sucessfully"
    }catch(E){
        console.log(E);   
        return "Unable to add data"
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


/*
import { DynamoDBClient, UpdateTableCommand, UpdateTableCommandInput } from "@aws-sdk/client-dynamodb";
import { client } from "../index";

export default function GSIinitialize(TableName:string){
    const params: UpdateTableCommandInput = {
        TableName: TableName, 
        AttributeDefinitions: [
            { AttributeName: "GSI1PK", AttributeType: "S" },
            { AttributeName: "GSI1SK", AttributeType: "S" },
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: "GSI1",
                    KeySchema: [
                        { AttributeName: "GSI1PK", KeyType: "HASH" }, 
                        { AttributeName: "GSI1SK", KeyType: "RANGE" }, 
                    ],
                    Projection: {
                        ProjectionType: "ALL", 
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5, 
                        WriteCapacityUnits: 5, 
                    },
                },
            },
        ],
    };

    try{
        client.send(new UpdateTableCommand(params))
            .then((data) => {
                console.log("GSI created successfully:", data);
            })
            .catch((error) => {
                console.error("Error creating GSI:", error);
            });
    }catch(e){
        console.log(e);
        
    }
}
*/