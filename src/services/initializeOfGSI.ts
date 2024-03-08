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