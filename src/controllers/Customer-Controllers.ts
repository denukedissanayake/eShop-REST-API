import { RequestHandler } from "express";
import bcrypt from 'bcrypt';
const Customer = require('../Schema/Customer');

const getAllCustomers: RequestHandler = async (req, res) => {
    const latest = req.query.latest
    try {
        const retrivedCustomer = latest ?
            await Customer.find().sort({createdAt : -1}).limit(10)
            : await Customer.find();
        res.json( retrivedCustomer ).status(200);
    } catch (e) {
        res.json("Error while fetching Customers").status(500)
    }
}

const getCustomerById :RequestHandler = async (req, res) => {
    const customerId = req.params.id

    if (!customerId) {
        return res.json("Customer not found").status(404);
    }
    try {
        const retrivedCustomer = await Customer.findOne({ _id: customerId });
        res.json( retrivedCustomer ).status(200);
    } catch (e) {
        res.json("Error while fetching Customer").status(500);
    }
}

const updateCustomer :RequestHandler = async (req, res) => {
    const customerId = req.params.id
    if (!customerId) {
        return res.json("Customer not found").status(404);
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, {
            $set : req.body
        }, { new: true });
        res.json(updatedCustomer).status(200);
    } catch (e) {
        return res.json("Error while updating Customer").status(500);
    }
}

const deleteCustomer :RequestHandler = async (req, res) => {
    const customerId = req.params.id

    if (!customerId) {
        return res.json("Customer not found").status(404);
    }
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        res.json( deletedCustomer ).status(200);
    } catch (e) {
        return res.json("Error while deleting Customer").status(500);
    }
}

const customerStats: RequestHandler = async (req, res) => {
    const date = new Date();
    const lastYesr = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const customerData = await Customer.aggregate([
            {
                $match: { createdAt: {$gte : lastYesr} }
            },
            {
                $project: {
                    month : { $month : "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month", 
                    total : {$sum : 1}
                }
            }
        ]);
        res.json(customerData).status(200);
    } catch (e) {
        return res.json("Error while fetching stats").status(500);
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    customerStats,
}