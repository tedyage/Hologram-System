const light = require("../models/Light");

var getLightsByScene = async(sceneid)=>{
    return await light.findAll({
        where:{
            sceneid:sceneid
        }
    });
};

module.exports = {
    getLightsByScene:getLightsByScene
};