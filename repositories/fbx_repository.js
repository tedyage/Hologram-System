const fbx = require('../models/Fbx');

var getFbxByScene = async(sceneId)=>{
    return await fbx.findAll({
        where:{
            sceneId:sceneId
        }
    });
};

module.exports = {
    getFbxByScene:getFbxByScene
};