import { addItemToOrders, createCustomer, createOrderForCustomer, getCustomer, getOrderDetail, getOrderDetailsUsingGSI } from '../../src/Services/CustomerService';
import { client } from '../../src/index';


jest.mock("../../src/index")

describe('getOrderDetail', () => {
    test('should return order details when queried with a valid OrderId', async () => {
        
        const orderId = '2';
        const expectedItems = [
            { name: 'raja', email: 'raja@sample.com' },
            { name: 'rajasanthosh', email: 'rajasanthosh@sample.com' }
          ];

        const result = await getOrderDetail(orderId);        
        
        expect(result).toEqual("Error")
    });

    test('should handle errors ', async () => {
        
        const orderId = '12';
        

        const result = await getOrderDetail(orderId);

        expect(result).toEqual('Error');
    });

    test("should add items to the table", async () => {

        const orderId='1', itemId='1',content='description',price=27;

        (client.send as jest.Mock).mockResolvedValueOnce({})

        const res = await addItemToOrders(orderId,itemId,content,price)

        expect(res).toEqual("added sucessfully")

    })

    jest.mock('@aws-sdk/client-dynamodb'); 

    it("should create an order for a customer", async () => {
        const customer = "customer123";
        const orderId = 12345;
        const date = new Date();
        const amount = 100;
        const noOfItems = 5;

        const res = await createOrderForCustomer(
          customer,
          orderId,
          date,
          amount,
          noOfItems
        );

        console.log(res);
          
        expect(res).toBeUndefined();
    });
    
});

describe('getCustomer', () => {
    it('should return customer details when customer exists', async () => {
      const mockResponse = {
        Items: [
          {
            name: { S: 'Test Customer' },
            email: { S: 'test@example.com' },

          }
        ]
      };
      (client.send as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const result = await getCustomer('TestCustomer');
      console.log(result);
      
      expect(result).toEqual([{"Amount": undefined, "CreatedAt": undefined, "Numberitems": undefined, "OrderId": undefined, "Status": undefined, "email": {"S": "test@example.com"}, "name": {"S": "Test Customer"}}]);
    });
  
    it('should return "No Customer Details" when customer does not exist', async () => {
      const mockResponse = { Items: [] };
      (client.send as jest.Mock).mockResolvedValueOnce(mockResponse);
  
      const result = await getCustomer('NonExistentCustomer');
  
      expect(result).toEqual([]);
    });
  
    it('should return "No Customer Details" on error', async () => {
      (client.send as jest.Mock).mockRejectedValueOnce(new Error('Internal Server Error'));
  
      const result = await getCustomer('TestCustomer');
  
      expect(result).toEqual('No Customer Details');
    });
  });

  describe('createCustomer', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new customer successfully', async () => {
        const username = 'testuser';
        const email = 'test@example.com';

        (client.send as jest.Mock).mockResolvedValueOnce({});

        const result = await createCustomer(username, email);

        expect(result).toBe('Success');
    });

    test('should return "Already have an Account" if customer already exists', async () => {

        (client.send as jest.Mock).mockRejectedValueOnce(new Error('ConditionalCheckFailedException'));

        const result = await createCustomer('existinguser', 'existing@example.com');

        expect(result).toBe('Already have an Account');
    });
});

jest.mock('@aws-sdk/client-dynamodb'); 

describe('getOrderDetailUsingGSI', () => {
    test('should return order details when queried with a valid OrderId', async () => {
      const orderId = '2';

      const mockResponse = {
        Items: [
          { name: 'raja', email: 'raja@sample.com' },
          { name: 'rajasanthosh', email: 'rajasanthosh@sample.com' }
        ]
      };
      (client.send as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getOrderDetailsUsingGSI(orderId);

      expect(result).toEqual([
          { name: 'raja', email: 'raja@sample.com' },
          { name: 'rajasanthosh', email: 'rajasanthosh@sample.com' }
      ]);
    })
});

