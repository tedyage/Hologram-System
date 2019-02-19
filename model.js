const fs = require("mz/fs");
const db = require("./db");
const path = require("path");
//获取了model的路径
var fp = path.join(__dirname,"models");
//获取model文件名数组
var files = fs.readdirSync(fp).filter((f)=>{
    return f.endsWith(".js");
});

module.exports = {};

for(var file of files){
    //获取输出模块名称
    var name = file.substring(0,file.length-3);
    //加入到输出
    module.exports[name] = require(path.join(fp,name));
}

//将数据库同步方法加入到输出中
module.exports.sync = function(){
    db.sync();
}