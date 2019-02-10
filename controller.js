'use strict'
const koa_router = require("koa-router");
const fs = require("mz/fs");
const path = require("path");

var addMapping = function(router,mapping){
    var route_name;
    for(var url in mapping){
        if(url.toLowerCase().startsWith("get ")){
            //加入get请求
            route_name=url.substring(4);
            router.get(route_name,mapping[url]);
        }else if(url.toLowerCase().startsWith("post ")){
            //加入post请求
            route_name=url.substring(5);
            router.post(route_name,mapping[url]);
        }else if(url.toLowerCase().startsWith("put ")){
            //加入put请求
            route_name=url.substring(4);
            router.put(route_name,mapping[url]);
        }else if(url.toLowerCase().startsWith("delete ")){
            //加入delete请求
            route_name=url.substring(7);
            router.del(route_name,mapping(url));
        }else{
            //无效请求
            console.error(`Invalid url: ${url}`);
        }
    }
};

var addController = function(router,dir){
    //获取dir路径下所有的js文件名数组
    var files = fs.readdirSync(dir).filter((f)=>{
        return f.endsWith(".js");
    });
    //遍历该数组
    for(var file of files){
        file = path.join(dir,file);
        var mapping = require(file);
        addMapping(router,mapping);
    }   
};

module.exports = function(dir){
    //如果dir为空，则默认是controllers
    dir = dir||'controllers';
    dir = path.join(__dirname,dir);
    //定义koa_router类对象
    var router = new koa_router();
    addController(router,dir);
    //将路由集合返回
    return router.routes();
};