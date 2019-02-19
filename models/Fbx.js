'use strict'
const db = require("../db");
const Sequelize = require("sequelize");
const Scene = require("./Scene");

var Fbx = db.defineModel("fbx",{
    sceneId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Scene,
            key:'id',
            deferrable:Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    path:{
        type:Sequelize.STRING(200),
        allowNull:false,
    }
});

module.exports = Fbx;