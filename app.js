'use strict'
const koa = require('koa');
const static_file = require("./static_file");
const template = require("./template");
const rest = require("./rest");
const controller = require("./controller");

//定义koa类对象
var app = new koa();

//输出请求的用时（毫秒）
app.use(async(ctx,next)=>{
    var startTime = Date.now();
    await next();
    var processTime = Date.now()-startTime;
    console.log(`${ctx.request.method} ${ctx.request.path} procceeded in ${processTime}ms.`);
})
//引用获取静态文件的方法
app.use(static_file("/static/"));
//引用渲染页面模版文件的方法
var isdevelopment = process.env.ENV_NODE==="development";
app.use(template("views",{
    autoescape:true,
    noCache:isdevelopment,
    watch:isdevelopment,
    throwOnUndefined:false
}));
//引用Restify的方法
app.use(rest.Restify());
//引用controller的方法
app.use(controller());

//监听端口号3000
app.listen(3000);
console.log("The app starts to listen...");