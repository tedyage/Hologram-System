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
        get:function(){
            return 1+this.getDataValue('fov');
        }
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
});

module.exports = Camera;