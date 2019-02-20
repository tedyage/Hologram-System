'use strict'
const db = require("../db");
const Sequelize = require('sequelize');
const Scene = require("./Scene");

var Light = db.defineModel("light",{
    sceneId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Scene,
            key:'id',
            deferrable:Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    type:{
        type:Sequelize.INTEGER,
        allowNull:false,        
    },
    color:{
        type:Sequelize.STRING(10),
        allowNull:false,
    },
    intensity:{
        type:Sequelize.FLOAT(3,2),
        allowNull:false,
    }
});

module.exports = Light;