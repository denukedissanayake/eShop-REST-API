import { RequestHandler } from "express";
import bcrypt from 'bcrypt';
const User = require('../Schema/User');

const getAllUsers: RequestHandler = async (req, res) => {
    const latest = req.query.latest
    try {
        const retrivedUsers = latest ?
            await User.find().sort({createdAt : -1}).limit(10)
            : await User.find();
        res.json( retrivedUsers ).status(200);
    } catch (e) {
        res.json("Error while fetching Users").status(500)
    }
}

const getUserById :RequestHandler = async (req, res) => {
    const userId = req.params.id
    console.log(userId)
    if (!userId) {
        return res.json("User not found").status(404);
    }
    try {
        const retrivedUser = await User.findOne({ _id: userId });
        res.json( retrivedUser ).status(200);
    } catch (e) {
        res.json("Error while fetching User").status(500);
    }
}

const createUser: RequestHandler = async (req, res) => {
    if (req.body) {
        try {
            const retrivedUser = await User.findOne({ email: req.body.email });
            if (retrivedUser) {
                return res.json("User is already Available").status(409);
            }
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username,
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
                contactdetails: req.body.contactdetails || "",
                location: req.body.location || "",
                role: req.body.role,
            })

            try {
                const createdUser = await newUser.save();
                if (createdUser) {
                    res.json(createdUser).status(200);
                } else {
                    return res.json("user not created. Error while adding User").status(500);
                }
            } catch (e) {
                return res.json("Error while adding User").status(500);
            }

        } catch (e) {
            res.json("Error while adding user").status(500);
        }
    } else {
        return res.json("No data is found").status(500);
    }
}

const updateUser :RequestHandler = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        return res.json("User not found").status(404);
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set : req.body
        }, { new: true });
        res.json(updatedUser).status(200);
    } catch (e) {
        return res.json("Error while updating User").status(500);
    }
}

const deleteUser :RequestHandler = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        return res.json("User not found").status(404);
    }
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        res.json( deletedUser ).status(200);
    } catch (e) {
        return res.json("Error while deleting User").status(500);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser
}