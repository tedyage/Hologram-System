'use strict'
var jsonwebtoken = require('jsonwebtoken');
var APIError = require('../rest').APIError;

var secret_key = 'tedyage';

var Sign = function(user){
    return jsonwebtoken.sign({
        id:user.id,
        username:user.username
    },secret_key,{
        expiresIn:3600
    });
};

var Verify = function(token){   
    return jsonwebtoken.verify(token,secret_key);   
};

module.exports = {
    Sign:Sign,
    Verify:Verify
};