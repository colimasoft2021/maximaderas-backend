const jwt = require('jwt-simple')
const moment = require('moment');
const { token } = require('morgan');

const SECRET_KEY = 'Tokenmaximaderas00users'

exports.createAccessToken = function(user){
    const payload = {
        id: user._id,
        email: user.email,
        createToken: moment().unix(),
        exp: moment().add(3, "hours").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
}

exports.createRefreshToken = function(user){
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    }
    return jwt.encode(payload, SECRET_KEY)
};

exports.decodedToken = function(token) {
    return jwt.decode(token, SECRET_KEY, true);
}