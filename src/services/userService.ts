import User from "../Models/User";
import { client } from "../index";
import {
  GetItemCommand,
  PutItemCommand
} from "@aws-sdk/client-dynamodb";
import { error } from "console";

export async function registerUser(user: User) {
  try {
    const command = new PutItemCommand({
      TableName: "user",
      Item: {
        username: { S: user.username },
        password: { S: user.password },
        email: { S: user.email },
        userId: { S: user.userId },
      },
    });

    
    const data = await client.send(command);

    console.log(data);

    return "Success";
  } catch (e) {
    console.log(e);

    return "Already Have an Account";
  }
}

export async function authenticateUser(username: string, password: string) {
  const command = new GetItemCommand( {
    TableName: "user",
    Key: {
      username: { S: username },
    },
  });
  try {
    const items = await client.send(command);
    const item = (await items).Item;

    if (JSON.stringify(item?.password.S).slice(1, -1) == password) {
      return items;
    }
    throw error;
  } catch (e) {
    return null;
  }
}
