'use strict'
const db = require("../db");
const Sequelize = require("sequelize");
const Scene = require("./Scene");

var Camera = db.defineModel("camera",{
    sceneId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Scene,
            key:'id',
            deferrable:Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    fov:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0,
    },
    aspect:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0,
    },
    near:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
    far:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },   
    positionX:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
    positionY:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
    positionZ:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
    upX:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
    upY:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
    upZ:{
        type:Sequelize.FLOAT(10,2),
        allowNull:false,
        defaultValue:0.0,
    },
},{
    getterMethods:{
        position:function(){
            return [this.positionX,this.positionY,this.positionZ];
        },
        up:function(){
            return [this.upX,this.upY,this.upZ];
        }
    }
});

module.exports = Camera;