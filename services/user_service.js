'use strict'
const APIError = require("../rest").APIError;
const userRepository = require("../repositories/user_repository");

var login = async(data)=>{    
    var user = await userRepository.getUserByUsername(data.username);
    if(!user||user.id<=0)
        throw new APIError("user:error","用户名或密码不正确。");
    if(user.password!=data.password)
        throw new APIError("user:error","用户名或密码不正确。");
    return user;
}

module.exports={
    login:login
};

