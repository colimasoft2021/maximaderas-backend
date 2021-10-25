const Users = require("../models/users.model");
const bcrypt = require('bcrypt');
const jwt = require("../services/jwt");

const saltRounds = 10;

async function saveUser(req, res) {
  const data = req.body;
  console.log(data)
  // const passwordEncrypted = encryptPassword(req.body.password);
  bcrypt.hash(data.password, saltRounds, function (err, hash){
    data.password = hash
    try {
      const savedUser =  Users.create(data);
      res.send({
        savedUser: savedUser,
        status: 201
      });
    } catch (err) {
      res.send({
        message: err,
      });
    }
  })
}


function loginUser(req, res) {
  const params = req.body.data;
  const email = params.email;
  const password = params.password;

  Users.findOne({ email }, (err, result) =>{
    if (err) {
      res.send({
        status: 500,
        message: "Error",
      });
    } else {
      console.log(result)
      if (!result) {
        return res.send({
          status: 202,
          message: "Usuario no encontrado",
        });
      } else {
        bcrypt.compare(password, result.password, (err, check) => {
          if (err) {
            res.send({
              status: 500,
              message: "Error",
            });
          } else if(!check) {
            res.send({ status: 404, message: "La contraseña es incorrecta" });
          } else {
            if (!result.status) {
              res.send({
                status: 200,
                code: {
                  status: 200,
                  message: "El usuario no esta activo",
                },
              });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(result),
                refreshToken: jwt.createRefreshToken(result),
              });
            }
          }
        });
      }
    }
  });
}

module.exports = {
  saveUser,
  loginUser,
};
