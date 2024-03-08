import  User  from '../Models/user';
import {client} from '../index'
import { GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { error } from 'console';

export class UserService {
    public async registerUser(user: User) {        

        try{
            const command = new PutItemCommand( {
                TableName: 'user',
                Item:{
                    "username": {'S': user.username},
                    'password': {'S':user.password},
                    'email': {'S': user.email},
                    "userId":{'S': user.userId},                    
                },
            })
            
            const data = await client.send(command)
            
            console.log(data);
            
            return user;
        }
        catch(e){
            console.log(e);
            
            return e;
        }
    }

    public async authenticateUser(username: string,password: string){
        const params: GetItemCommandInput ={
            TableName: "user",
            Key:{
                "username": {'S':username}
            }
        }
        try{
            const items = client.send(new GetItemCommand(params));
            const item = (await items).Item

            if(JSON.stringify(item?.password.S).slice(1,-1) == password){
                return items; 
            }    
            throw error;
        }catch(e){
            
            return null;
        }
    }
}