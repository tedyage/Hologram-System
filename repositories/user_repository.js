'use strict'
var user = require("../models/User");

var getUserByUsername = async(username)=>{
    return await user.findOne({
        where:{
            username:username
        }
    });
}

module.exports = {
    getUserByUsername:getUserByUsername
};