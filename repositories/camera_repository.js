'use strict'
const camera = require("../models/Camera");

var getCameraByScene = async(sceneid)=>{
    return await camera.findOne({
        where:{
            sceneid:sceneid
        }
    });
};

module.exports = {
    getCameraByScene:getCameraByScene
};