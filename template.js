'use strict'
const nunjucks = require('nunjucks');
const path = require('path');

var createEnv = function(dir,option){
    //是否自动转义
    var autoescape = option.autoescape === undefined?true:option.autoescape;
    //是否不读缓存
    var noCache = option.noCache||true;
    //是否自动更新模版
    var watch = option.watch||true;
    //是否自动抛出undefined的异常
    var throwOnUndefined = option.throwOnUndefined||false;
    //初始化模版环境对象
    var env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(dir,{
            noCache:noCache,
            watch:watch
        }),{
            autoescape:autoescape,
            throwOnUndefined:throwOnUndefined
        }
    );
    //判断是否存在过滤器，如果存在，则加入到环境对象中
    if(option.filter){
        for(var f in option.filter){
            env.addFilter(f,option.filter[f]);
        }
    }

    return env;
};

module.exports = function(dir,option){
    //如果dir为空，则默认是views
    dir = dir||'views';
    dir = path.join(__dirname,dir);
    //生成模版环境对象
    var env = createEnv(dir,option);
    return async(ctx,next)=>{
        //上下文加入render方法
        ctx.render = function(name,model){
            ctx.response.type = "text/html";
            ctx.response.body = env.render(name,Object.assign({},ctx.state||{},model||{}));
        }
        await next();
    }
}