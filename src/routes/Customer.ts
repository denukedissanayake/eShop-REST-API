import express from 'express';
const customerControllers = require('../controllers/Customer-Controllers');
const { VerifyToken , VerifyAdmin, VerifyAdminOrModerators } = require('../utils/auth-middlewares');

const router = express.Router();

router.get("/", VerifyToken, VerifyAdminOrModerators, customerControllers.getAllCustomers);

router.get("/stats", VerifyToken, VerifyAdmin, customerControllers.customerStats);

router.get('/:id', VerifyToken,  customerControllers.getCustomerById);

router.put('/:id', VerifyToken, VerifyAdmin, customerControllers.updateCustomer);

router.delete('/:id', VerifyToken, VerifyAdmin, customerControllers.deleteCustomer);


module.exports = router