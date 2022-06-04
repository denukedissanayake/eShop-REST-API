import { RequestHandler } from "express";
import jwtDecode, { JwtPayload } from "jwt-decode";
const jwt = require('jsonwebtoken');

const VerifyToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader.toString().split(" ")[1]

    if (!token) {
        return res.json("Not Authorized - No token found").status(404);
    }

    if (token) {
        jwt.verify(token, process.env.JWT, (error : Error, user: Express.User) => {
            if (error) {
                return res.json("Invalid Token").status(403);
            }
           req.user = user
            next()
        } )
    }
}

const VerifyAuthorization: RequestHandler = (req, res, next) => {
    if (req.user['id'] === req.params.id || req.user['isAdmin']) {
        next()
    } else {
        return res.json("Not Authorized").status(401);
    }
}

const VerifyAdmin: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.json("Not Authorized - No token found").status(404);
    }

    const token = authHeader.toString().split(" ")[1]
    const userDetails = jwtDecode<JwtPayload>(token);
    const { role } = userDetails as any;

    if (role == "Admin") {
        next()
    } else {
        return res.json("Not Authorized").status(401);
    }
}

const VerifyAdminOrModerators: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.json("Not Authorized - No token found").status(404);
    }

    const token = authHeader.toString().split(" ")[1]
    const userDetails = jwtDecode<JwtPayload>(token);
    const { role } = userDetails as any;

    if (role == "Admin" || role == "Moderator") {
        next()
    } else {
        return res.json("Not Authorized").status(401);
    }
}

module.exports = {VerifyToken, VerifyAuthorization, VerifyAdmin, VerifyAdminOrModerators}