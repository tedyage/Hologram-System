'use strict'
var captchapng = require("captchapng2");
var APIError = require("../rest").APIError;
var userService = require("../services/user_service");

module.exports={
    'GET /api/admin/getCheckCode': async(ctx,next)=>{
        let rand = parseInt(Math.random()*9000+1000);
        ctx.session.checkCode = rand;
        //width:80, height:30, number: rand
        let png = new captchapng(80,30,rand);
        ctx.rest({
            img:'data:image/png;base64,'+png.getBuffer().toString('base64')
        });
    },
    'POST /api/admin/login': async(ctx,next)=>{
        if(!ctx.request.body)
            throw new APIError("no data","请输入用户信息。");  
        var data = ctx.request.body;
        if(!data.username||data.username=='')
            throw new APIError("username:null","请输入用户名。");
        if(!data.password||data.password=='')
            throw new APIError("password:null","请输入密码。");
        if(!data.verificationCode||data.verificationCode=='')
            throw new APIError("verificationCode:null","请输入验证码。");
        if(!ctx.session.checkCode)
            throw new APIError("verificationCode:invalid","验证码失效，请重新获取。");
        if(data.verificationCode!=ctx.session.checkCode.toString())
            throw new APIError("verificationCode:error","验证码错误。");        
        var result = await userService.login(data);
        
        ctx.rest(result);
    }
}