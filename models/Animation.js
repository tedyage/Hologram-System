'use strict'
const db = require('../db');
const Sequelize = require('sequelize');
const Scene = require('./Scene');

var Animation = db.defineModel('Animation',{
    sceneId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Scene,
            key:'id',
            deferrable:Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    rotateSpeed:{
        type:Sequelize.FLOAT(5,2),
        allowNull:false,
    },
    minScale:{
        type:Sequelize.FLOAT(5,2),
        allowNull:false,
    },
    maxScale:{
        type:Sequelize.FLOAT(5,2),
        allowNull:false,
    },
    scaleSpeed:{
        type:Sequelize.FLOAT(5,2),
        allowNull:false,
    }
});

module.exports = Animation;