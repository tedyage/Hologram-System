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
    position:{
        type:Sequelize.ARRAY(Sequelize.FLOAT(10,2)),
        allowNull:false,
        defaultValue:[0.0,0.0,0.0],
    },
    up:{
        type:Sequelize.ARRAY(Sequelize.FLOAT(10,2)),
        allowNull:false,
        defaultValue:[0.0,0.0,0.0],
    },
});

module.exports = Camera;