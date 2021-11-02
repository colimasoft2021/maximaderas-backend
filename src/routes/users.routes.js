const express = require("express");
const router = express.Router();
const UsersController = require('../controllers/users.controller');


router.post('/save-user', UsersController.saveUser);
router.post('/login-user', UsersController.loginUser);
router.get('/verify-account-client', UsersController.verifyToken);
router.post('/recuperacion-clave', UsersController.getPassword);
router.post('/clave-nueva', UsersController.UpdatePassword)

module.exports = router;

