'use strict'
var user = require("../models/User");

var getUserByUsername = async(username)=>{
    return await user.findOne({
        where:{
            username:username
        }
    });
};

var getUserById = async(id)=>{
    return await user.findById(id);
}

module.exports = {
    getUserByUsername:getUserByUsername,
    getUserById:getUserById
};