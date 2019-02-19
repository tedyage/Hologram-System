const db = require('../db');
const Sequelize = require('sequelize');

var Scene = db.defineModel('scene',{
    name:{
        type:Sequelize.STRING(50),
        allowNull:false,
        unique:'sceneNameIndex'
    }
});

//输出定义的模型
module.exports = Scene;