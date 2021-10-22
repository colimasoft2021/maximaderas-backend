const express = require("express");
const router = express.Router();
const UsersController = require('../controllers/users.controller');

router.post('/save-user', UsersController.saveUser);
router.post('/login-user', UsersController.loginUser);

module.exports = router;

