'use strict'

const APIError = require('../rest').APIError;
const LightType = require('../enums/light_type');
const sceneRepository = require('../repositories/scene_repository');
const cameraRepository = require('../repositories/camera_repository');
const lightRepository = require('../repositories/light_reposition');
const fbxRepository = require('../repositories/fbx_repository');
const animationRepository = require('../repositories/animation_repository');
const sceneService = require("../services/scene_service");

module.exports={
    "GET /api/GetData": async(ctx,next)=>{       
        var result = await sceneService.getSceneData(ctx.request.query.id);
        ctx.rest(result);
    }
}