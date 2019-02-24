'use strict'
var scene = require("../models/Scene");

var getSceneById = async(id)=>{
    var result = await scene.findById(id);
    return result;
};

var getScenesByPagenation = async(query)=>{
    var where = {};
    var offset = (query.pageIndex-1)*query.pageSize;
    var limit = query.pageSize;
    if(query.keyword&&query.keywork!='')
        where.name = query.keyword;
    var result = await scene.findAndCountAll({
        where:where,
        limit:limit,
        offset:offset,
    });
    return result;
}

module.exports = {
    getSceneById:getSceneById,
    getScenesByPagenation:getScenesByPagenation
};