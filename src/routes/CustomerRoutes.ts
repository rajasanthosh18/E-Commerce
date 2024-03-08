import express, { Router } from 'express';
import { verifyToken } from '../Middleware/AuthMiddleware';
import { addItemToOrder, createCustomers,createOrderForCustomers,getCustomers,getOrderDetailByGSI,getOrderDetails, updateCustomerOrderIndexe }  from '../Controllers/CustomerController';
const router = express.Router();

router.post('/customers',verifyToken,createCustomers)
router.post('/order/:orderId/item',verifyToken,addItemToOrder)
router.post('/customer/:customerName/order',verifyToken,createOrderForCustomers)


router.get('/customers',verifyToken,getCustomers)
router.get('/order/:orderId', verifyToken, getOrderDetails)
router.get('/customer/order/:orderId',verifyToken,updateCustomerOrderIndexe)
router.get('/orders/:orderId/details',verifyToken,getOrderDetailByGSI)

export default router;