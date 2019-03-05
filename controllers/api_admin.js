'use strict'
const captchapng = require("captchapng2");
const APIError = require("../rest").APIError;
const userService = require("../services/user_service");
const sceneService = require("../services/scene_service");
const jwt = require('../authentications/jwt_helper');
const fs = require('mz/fs');
const path = require('path');

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
        var user = await userService.login(data);
        var token = jwt.Sign(user);
        var result = {token:token};
        ctx.rest(result);
    },
    'GET /api/admin/getAuthorization':async(ctx,next)=>{        
        var authorization = ctx.authorization;
                     
        ctx.rest(authorization);
    },
    'GET /api/admin/getScenesByPagination':async(ctx,next)=>{
        //认证用户信息
        if(!ctx.authorization)
            throw new APIError("Authorization:Error","用户信息认证失败。");       
        var scenes = await sceneService.getScenesByPagenation(ctx.request.query);
        ctx.rest(scenes);
    },
    "POST /api/admin/uploadModel":async(ctx,next)=>{
        //认证用户信息
        if(!ctx.authorization)
            throw new APIError("Authorization:Error","用户信息认证失败。");
        if(!ctx.request.files||!ctx.request.files.file)
            throw new APIError("Upload:Error","没有上传文件。");
        var file = ctx.request.files.file;
        if(file.type!="application/octet-stream")
            throw new APIError("Upload:Error","文件格式不正确。");
        var rs = fs.createReadStream(file.path);
        var writePath = path.join(__dirname,"../uploads/models");
        if(!(await fs.exists(writePath)))
            throw new APIError("Upload:Error","上传路径不存在。");
        //根据当前时间戳，新建子文件夹
        var now = Date.now();
        var writePath = path.join(writePath,now.toString());
        await fs.mkdir(writePath);
        //生成文件名
        var filename = path.join(writePath,file.name);
        let ws = fs.createWriteStream(filename);
        rs.pipe(ws);
        //生成结果url
        var res = {
            filename:file.name,
            url:"/uploads/models/"+now+"/"+file.name
        };
        ctx.rest(res);
    }, 
    "POST /api/admin/addScene":async(ctx,next)=>{
        //认证用户信息
        if(!ctx.authorization)
            throw new APIError("Authorization:Error","用户信息认证失败。");
        var data = ctx.request.body;
        ctx.rest("abc");
    }
}