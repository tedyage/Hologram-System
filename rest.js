'use strict'
var authorization = require('./authentications/authorization');


module.exports = {
    //处理api内部逻辑异常类
    APIError:function(code,message){
        this.code = code||'InternalError: unknown_error';
        this.message = message||'';
    },   
    Authorization:function(preFix){
        //如果preFix为空，则默认是/api/
        preFix = preFix||'/api/';

        return async(ctx,next)=>{
            //获取请求路径
            var rpath = ctx.request.path;
            if(rpath.startsWith(preFix)){
                ctx.authorization = await authorization(ctx.request.header.authorization);
                await next();
            }else{
                await next();
            }
        }
    },
    Restify:function(preFix){
        //如果preFix为空，则默认是/api/
        preFix = preFix||'/api/';

        return async(ctx,next)=>{
            //获取请求路径
            var rpath = ctx.request.path;
            if(rpath.startsWith(preFix)){
                ctx.rest = function(result){
                    ctx.response.status = 200;
                    ctx.response.type = "application/json";
                    ctx.response.body = result;
                }
                try{
                    await next();
                }catch(e){
                    ctx.response.status = 400;
                    ctx.response.type = "application/json";
                    ctx.response.body = {
                        code:e.code||'InternalError: unknown_error',
                        message:e.message||''
                    };
                }
            }else{
                await next();
            }           
        }
    }
}