import express from 'express';
const userControllers = require('../controllers/User-Controller');
const { VerifyToken , VerifyAdmin , VerifyAuthorization } = require('../utils/auth-middlewares');

const router = express.Router()

router.get("/", VerifyToken, VerifyAdmin, userControllers.getAllUsers);

router.post("/", VerifyToken, VerifyAdmin, userControllers.createUser);

router.get('/:id', VerifyToken, VerifyAuthorization, userControllers.getUserById);

router.put('/:id', VerifyToken, VerifyAuthorization, userControllers.updateUser);

router.delete('/:id', VerifyToken, VerifyAuthorization, userControllers.deleteUser);


module.exports = router