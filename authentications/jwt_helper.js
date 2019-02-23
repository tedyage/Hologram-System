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

var Verify = function(token){
    var user;
    try{
        user = jsonwebtoken.verify(token,secret_key,);
    }
    catch(e){
        console.error(e);
        throw new APIError("Verify:error","Verify has error.");
    }
    return user;
};

module.exports = {
    Sign:Sign,
    Verify:Verify
};