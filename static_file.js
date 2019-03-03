const fs = require("mz/fs");
const path = require("path");
const mime = require("mime");

module.exports = function(url,dir){
    //如果dir为空，则默认是static
    dir = dir||"static";
    dir = path.join(__dirname,dir);
    
    return async(ctx,next)=>{
        //获取请求的路径
        var rpath = ctx.request.path;
        //判断请求路径是否以dir开头
        if(rpath.startsWith(url)){
            //获取文件的完整文件名
            let filename = rpath.substring(url.length);
            filename = path.join(dir,filename);
            var stat = await fs.stat(filename);
            if(stat.isFile()){
                //读取文件并返回文件内容
                ctx.response.type = mime.getType(filename);
                ctx.response.body = await fs.readFile(filename);
            }
        }
        await next();
    }
};