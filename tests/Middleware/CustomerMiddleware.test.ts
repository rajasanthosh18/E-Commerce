import { filteredData } from '../../src/Middleware/CustomerMiddleware';

describe('filteredData', () => {
    test('should return an array of filtered items', async() => {
        const data = [
            { name: 'John Doe', email: 'john@example.com', OrderId: '123', Status: 'Pending', Numberitems: 2, CreatedAt: '2024-03-07', Amount: 100 },
            { name: 'Jane Smith', email: 'jane@example.com', OrderId: '456', Status: 'Completed', Numberitems: 3, CreatedAt: '2024-03-08', Amount: 150 },
        ];

        const result = await filteredData(data);

        expect(result).toHaveLength(2); 
        expect(result[0]).toEqual({ 
            name: 'John Doe',
            email: 'john@example.com',
            OrderId: '123',
            Status: 'Pending',
            Numberitems: 2,
            CreatedAt: '2024-03-07',
            Amount: 100,
        });
        expect(result[1]).toEqual({ 
            name: 'Jane Smith',
            email: 'jane@example.com',
            OrderId: '456',
            Status: 'Completed',
            Numberitems: 3,
            CreatedAt: '2024-03-08',
            Amount: 150,
        });
    });

    test('should return an empty array if input data is empty', async () => {

        const data: any[] = [];

        const result = await filteredData(data);

        expect(result).toEqual([]); 
    });

});
