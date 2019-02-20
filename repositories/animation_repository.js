'use strict'
const animation = require('../models/Animation');

var getAnimationByScene = async(sceneId)=>{
    return await animation.findOne({
        where:{
            sceneId:sceneId
        }
    });
};

module.exports = {
    getAnimationByScene:getAnimationByScene
};
