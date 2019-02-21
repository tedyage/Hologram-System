'use strict'
var captchapng = require("captchapng2")

module.exports={
    'GET /api/admin/getCheckCode': async(ctx,next)=>{
        let rand = parseInt(Math.random()*9000+1000);
        ctx.session.checkCode = rand;
        console.log(ctx.session.checkCode);
        //width:80, height:30, number: rand
        let png = new captchapng(80,30,rand);
        ctx.rest({
            img:'data:image/png;base64,'+png.getBuffer().toString('base64')
        });
    }
}