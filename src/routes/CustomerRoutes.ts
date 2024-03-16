import express from 'express';
import { verifyToken } from '../Middleware/AuthMiddleware';
import { addItemToOrder, createCustomers,createOrderForCustomers,getCustomers,getOrderDetailByGSI,getOrderDetails, updateCustomerOrderIndexe }  from '../Controllers/CustomerController';

const router = express.Router();


router.post('/customers',verifyToken,createCustomers)
router.post('/order/:orderId/item',verifyToken,addItemToOrder)
router.post('/customer/:customerName/order',verifyToken,(req,res)=>{createOrderForCustomers(req,res)})


router.get('/customers',verifyToken,getCustomers)
router.get('/order/:orderId', verifyToken, async(req,res)=>{ await getOrderDetails(req,res)})
router.get('/customer/order/:orderId',verifyToken,(req,res)=>{updateCustomerOrderIndexe(req,res)})
router.get('/orders/:orderId/details',verifyToken,(req,res)=>{getOrderDetailByGSI(req,res)})

export default router;