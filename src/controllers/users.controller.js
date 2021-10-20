const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
async function saveUser(req, res) {
    const body = req.body;
    const passwordEncrypted = encryptPassword(req.body.password);
    req.body.password = passwordEncrypted;
    // try {
    //   const savedUser = await Users.create(body);
    //   res
    //     .status(201)
    //     .json(savedUser);
    // } catch (err) {
    //   res
    //     .status(500)
    //     .json({
    //       message: err
    //     });
    // }
};
function encryptPassword(password){
  const hash = bcrypt.hashSync(password, 10);
	return hash;
}
module.exports = {
  saveUser
};
