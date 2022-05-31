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
                name: req.body.name,
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

    if (req.body.newPassword) {
        if (!req.body.oldPassword) {
            return res.json("Please provide both New and Old Passwords").status(404);
        }
        try {
            const retrivedUser = await User.findOne({ _id: userId });
            const isPasswordCorrect = await bcrypt.compare(req.body.oldPassword, retrivedUser.password);
            if (!isPasswordCorrect) {
                return res.json("Old Password in not correct!!!").status(404);
            }
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            delete req.body.oldPassword
            delete req.body.newPassword
            req.body.password = hashedPassword
        } catch (e) {
            return res.json("Error while updating password").status(500);
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set : req.body
        }, { new: true });
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            contactdetails: updatedUser.contactdetails || "",
            location: updatedUser.location || "",
            role: updatedUser.role || "",
            photo: updatedUser.photo || "",
        }).status(200);
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