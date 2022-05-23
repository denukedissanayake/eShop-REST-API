import express from 'express';
const customerControllers = require('../controllers/Customer-Controllers');
const { VerifyToken , VerifyAdmin } = require('../utils/auth-middlewares');

const router = express.Router();

router.get("/", VerifyToken, VerifyAdmin, customerControllers.getAllCustomers);

router.get("/stats", VerifyToken, VerifyAdmin, customerControllers.customerStats);

router.get('/:id', VerifyToken,  customerControllers.getCustomerById);

router.put('/:id', VerifyToken, customerControllers.updateCustomer);

router.delete('/:id', VerifyToken, customerControllers.deleteCustomer);


module.exports = router