const express = require("express");
const router = express.Router();
const UsersController = require('../controllers/users.controller');

router.post('/save-user', UsersController.saveUser);
module.exports = router;
