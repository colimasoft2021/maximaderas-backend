const Users = require("../models/users.model");
const bcrypt = require('bcrypt');
const jwt = require("../services/jwt");
const nodemailer = require("nodemailer");
const { get } = require("mongoose");
const { token } = require("morgan");
const { updateOne } = require("../models/users.model");

const saltRounds = 10;

async function saveUser(req, res) {
  const InicialData = req.body.data;
  const { name, lastName, city, postalCode, email, status } = InicialData;
  const token = generateRandomString(10);
  const data = new Users();

  bcrypt.hash(InicialData.password, saltRounds, async function (err, hash){
    try {
      data.name = name;
      data.lastName = lastName;
      data.city = city;
      data.postalCode = postalCode;
      data.email = email;
      data.status = "inactive";
      data.confirmationCode = token;
      data.password = hash;

      console.log(data);

      const savedUser =  await data.save();
      console.log(saveUser);
      if(saveUser){
        sendEmailConfirmation(data.email, token);
      }
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


function generateRandomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


//FUNCIÓN PARA ENVIO DE CORREO DE CONFIRMACIÓN
async function sendEmailConfirmation(correo, token) {
	// const urlConfirmation = 'http://localhost:3977/api/verify-account-client?token=' + token;
  const urlConfirmation = 'https://app-maximaderas.herokuapp.com/api/verify-account-client?token=' + token;
	contentHTML = `
		<head>
			<meta charset="utf-8">
			<Style>
				div {
					text-align: center;
				}
				img {
					display: block;
  					margin-left: auto;
  					margin-right: auto;
				}
			</Style>
		</head>
		<body>
			<div>
				<h1>Hola, gracias por registrarte en Maderas Polanco Online !</h1>
				<h3>A contiuación da click en el siguiente enlance para confirmar tu cuenta ${urlConfirmation}</h3>
				<h3>Si tú no te registraste en Maderas Polanco Online escribe un mensaje a la dirección de correo ventas@maderaspolanco.com para que den de baja la cuenta.</h3>
				<img class="imagen" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTT5esbtreE-4WDrqmo9jJEQ5KWAhJlmmM1MA&usqp=CAU" alt="Maderas Polanco">
			</div>
		</body>
	`;

	var transporter = nodemailer.createTransport({
		host: "mail.colimasoft.com",
		port: 587,
		secure: false,
		auth: {
			user: "isaac.carrillo@colimasoft.com",
			pass: "colimasoft",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

  console.log(correo);

	var mailOptions = {
		from: "Maderas Polanco <ventas@maderaspolanco.com>",
		to: correo,
		subject: "Registro en Maderas Polanco Shop",
		html: contentHTML,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Correo enviado: " + info.response);
		}
	});
}


async function verifyToken(req, res) {
  console.log(req.query);
  const { token } = req.query;
  const dataClient = await getClientByToken(token);
  console.log(dataClient);
  console.log(token);
  if(dataClient){
    const activate = await activateClient(dataClient.email);
    if(activate == 1) {
      res.send({status: 200, message: 'El usuario se ha activado'});
    } else {
      res.send({status: 404, message: 'Error al activar la cuenta'});
    }
  }
}


const getClientByToken = function (token) {
	var dataClient = Users.findOne({
    token: token
  }).exec();
	return dataClient;
};

const activateClient = async function(email){
  const query = {email: email};
  const update = {
    status: 'active'
  };
  const options = { returnNewDocument: true };
  return Users.findOneAndUpdate(query, update, options)
  .then(updatedDocument => {
      if(updatedDocument) {
        return 1
      } else {
        return 2;
      }
  })
  .catch(err => {return 'error';})
}

async function getPassword(req, res){
  console.log(req.body.data)
  const token = generateRandomString(10);
  const {email} = req.body.data

  Users.findOne({email: email}, (err, result) =>{
    if(result){
      Users.findOneAndUpdate({email:email}, {tokenPassword: token},{returnNewDocument:true})
      .then(updatedDocument =>{
        if(updatedDocument){
          SendEmailRecoveryPassword(email, token)
          res.send({status:200, message:'Correo de recuperacion de contraseña enviado'})
        }else{
          res.send({status:404, message:'No enviado'})
        }
      })
    }
  }
  )
}


async function SendEmailRecoveryPassword(correo, token){


  const urlRestablecimiento = 'http://localhost:3000/clave-nueva?token=' + token;

  console.log(correo)
  console.log(token)
  
  contentHTML = `
  <head>
    <meta charset="utf-8">
    <Style>
      div {
        text-align: center;
      }
      img {
        display: block;
          margin-left: auto;
          margin-right: auto;
      }
    </Style>
  </head>
  <body>
    <div>
      <h1>Hola </h1>
      <h3>Estas recibiendo este correo debido a que se hizo una solicitud de restablecimiento de contraseña para tu cuenta.</h3>
      <h3>A contiuación da click en el siguiente enlance para restablecer su contraseña ${urlRestablecimiento}</h3>
      <h3>Si tú no te registraste en Maderas Polanco Online escribe un mensaje a la dirección de correo ventas@maderaspolanco.com para que den de baja la cuenta.</h3>
      <img class="imagen" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTT5esbtreE-4WDrqmo9jJEQ5KWAhJlmmM1MA&usqp=CAU" alt="Maderas Polanco">
    </div>
  </body>
`;

var mailOptions = {
  from: "Maderas Polanco <ventas@maderaspolanco.com>",
  to: correo,
  subject: "Restablecer contraseña",
  html: contentHTML,
};

var transporter = nodemailer.createTransport({
  host: "mail.colimasoft.com",
  port: 587,
  secure: false,
  auth: {
    user: "isaac.carrillo@colimasoft.com",
    pass: "colimasoft",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Correo enviado: " + info.response);
  }
});
  
}

async function UpdatePassword (req, res){
  const body = req.body.data;
  const {token, password} = body
  console.log(body)
  
  bcrypt.hash(password, saltRounds, async function (err, hash) {
     Users.findOneAndUpdate({tokenPassword: token}, {password: hash},{returnNewDocument:true})
    .then(updatedDocument =>{
      if(updatedDocument){
        res.send({status:200, message:'recuperacion de contraseña hecha'})
      }else{
        res.send({status:404, message:'No enviado'})
      }
    }) 
  })
}


module.exports = {
  saveUser,
  loginUser,
  verifyToken,
  getPassword,
  UpdatePassword, 
};
