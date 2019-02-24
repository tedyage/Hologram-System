'use strict'
const APIError = require("../rest").APIError;
const jwt = require("./jwt_helper");
const userService = require("../services/user_service");

module.exports = async(token)=>{
    if(!token||token=='')
        return null;
    else{
        var user;
        try{
            var res = await jwt.Verify(token);
            user = await userService.getUserById(res.id);
            if(!user)
                throw new APIError('Authorization:error','获取用户信息失败。');
        }catch(e){
            console.error(e);
            throw e;
        }              
        return user;
    }
}