
export async function filteredData(data: any) {
    const filteredItem: any [] = []        
    const filteredResponse = data.map((item: { name: any; email: any; OrderId: any; Status: any; Numberitems: any; CreatedAt: any; Amount: any; }) => {
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
    
    return filteredItem;
}