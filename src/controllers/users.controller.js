const Users = require('../models/users.model');
async function saveUser(req, res) {
    const body = req.body;
    try {
      const savedUser = await Users.create(body);
      res
        .status(201)
        .json(savedUser);
    } catch (err) {
      res
        .status(500)
        .json({
          message: err
        });
    }
};

module.exports = {
  saveUser
};
