'use strict'
var jsonwebtoken = require('jsonwebtoken');
var APIError = require('../rest').APIError;

var secret_key = 'tedyage';

var Sign = function(user){
    var token = '';
    try{
        token = jsonwebtoken.sign({
            id:user.id,
            username:user.username
        },secret_key,{
            expiresIn:86400
        });
        console.log(token);
    }catch(e){
        console.error(e);
        throw new APIError("Authentication:error","Authentication has error.")
    }
    return token;
};

module.exports = {
    Sign:Sign
};