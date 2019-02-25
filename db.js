'use strict'
const Sequelize = require('sequelize');
const config = require('./config');

//Date加入类型，加入Format方法，可将日期转换成yyyy-MM-dd hh:mm:ss类型的字符串
Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var sequelize = new Sequelize(config.database,config.username,config.password,{
    dialect:'mysql',
    host:config.host,
    pool:{
        min:0,
        max:5,
        idle:10000
    }
});

var defineModel = function(modelname,attributes){
    var attrs = {};  //初始化该实体类的属性
    //模型主键字段名默认为id，整型，且自增
    attrs.id = {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,      
        allowNull:false 
    };
    //遍历对象attributes，key为对象内部属性的属性名
    for(var key in attributes){
        //value是attrbutes内部的属性值
        var value = attributes[key];
        //判断该属性值是否是js对象，同时对象里是否有type属性
        if(typeof value === 'object' && value['type']){
            //该属性默认不可为空，除非已经定义了allowNull属性
            value.allowNull = value.allowNull||false;
            //将该属性加入到attrs
            attrs[key] = value;
        }else{
            attrs[key] = {
                type:value,
                allowNumm:false,
            };
        }       
    }
    attrs.createtime = {
        type:Sequelize.BIGINT,
        allowNull:false,
        get(){           
            return new Date(this.getDataValue('createtime')).Format('yyyy-MM-dd hh:mm:ss');
        }
    };
    attrs.updatetime = {
        type:Sequelize.BIGINT,
        allowNull:false,
        get(){           
            return new Date(this.getDataValue('updatetime')).Format('yyyy-MM-dd hh:mm:ss');
        }
    };
    attrs.version = {
        type:Sequelize.BIGINT,
        allowNull:false
    };
    return sequelize.define(modelname,attrs,{
        tableName:modelname,
        timestamps:false,
        hooks:{
            beforeValidate:function(obj){
                let now = Date.now();
                //判断该数据是否是新数据，
                //是则生成新的创建时间/修改时间，版本号为1
                //不是则更新修改时间，版本号自增
                if(obj.isNewRecord){
                    obj.createtime = now;
                    obj.updatetime = now;
                    obj.version = 1;
                }else{
                    obj.updatetime = now;
                    obj.version++;
                }
            }
        }
    });
};

module.exports = {
    defineModel:defineModel,
    sync:function(){
        sequelize.sync({force:false});
    }
};