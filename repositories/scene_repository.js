'use strict'
var scene = require("../models/Scene");

var getSceneById = async(id)=>{
    var result = await scene.findById(id);
    return result;
};

module.exports = {
    getSceneById:getSceneById
};