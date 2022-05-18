import express from 'express';
const customerControllers = require('../controllers/Customer-Controllers');
const { VerifyToken , VerifyAdmin , VerifyAuthorization } = require('../utils/auth-middlewares');

const router = express.Router();

router.get("/", VerifyToken, VerifyAdmin, customerControllers.getAllCustomers);

router.get("/stats", VerifyToken, VerifyAdmin, customerControllers.customerStats);

router.get('/:id', VerifyToken, VerifyAuthorization, customerControllers.getCustomerById);

router.put('/:id', VerifyToken, VerifyAuthorization, customerControllers.updateCustomer);

router.delete('/:id', VerifyToken, VerifyAuthorization, customerControllers.deleteCustomer);


module.exports = router