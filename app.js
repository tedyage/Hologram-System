'use strict'
const koa = require('koa');

const controller = require("./controller");

//定义koa类对象
var app = new koa();

app.use(controller());

//监听端口号3000
app.listen(3000);
console.log("The app starts to listen...");