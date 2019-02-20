'use strict'

const APIError = require('../rest').APIError;
const LightType = require('../enums/light_type');
const sceneRepository = require('../repositories/scene_repository');
const cameraRepository = require('../repositories/camera_repository');
const lightRepository = require('../repositories/light_reposition');
const fbxRepository = require('../repositories/fbx_repository');
const animationRepository = require('../repositories/animation_repository');

module.exports={
    "GET /api/GetData": async(ctx,next)=>{       
        var result = {
            camera:{},
            lights:{
                ambientLight:[],
                directionalLight:[]
            },
            fbx:[],
            rotation:{
                speed:0
            },
            scale:{
                min_Scale:1.0,
                max_Scale:1.0,
                speed:0
            }
        };
        var id = ctx.request.query.id;
        if(!id || parseInt(id)<=0)
            throw new APIError("Id not valid","Scene id is not valid.");
        id = parseInt(id);
        var scene = await sceneRepository.getSceneById(id);
        if(!scene||scene.id<=0)
            throw new APIError("Scene not valid","Scene is not valid.");
        
        var camera = await cameraRepository.getCameraByScene(scene.id);
        if(!camera||camera.id<=0)
            throw new APIError("Camera not valid","Camera is not valid.");
        result.camera = {
            fov:camera.fov,
            aspect:camera.aspect,
            near:camera.near,
            far:camera.far,
            position:[camera.positionX,camera.positionY,camera.positionZ],
            up:[camera.upX,camera.upY,camera.upZ]
        };
        camera = null;

        result.lights={ambientLight:[],directionalLight:[]};
        var lights = await lightRepository.getLightsByScene(scene.id);
        if(!lights||lights.length<=0)
            throw new APIError("Light not valid","Light is not valid.");     
        for(var light of lights){
            var typeIndex = light.type - 1;
            if(LightType[typeIndex]=="ambientLight"){
                result.lights.ambientLight.push({color:light.color,intensity:light.intensity});
            }else if(LightType[typeIndex]=="directionalLight"){
                result.lights.directionalLight.push({color:light.color,intensity:light.intensity});
            }
        }
        lights.splice(0,light.length);

        result.fbx=[];
        var fbses = await fbxRepository.getFbxByScene(scene.id);
        if(!fbses||fbses.length<=0)
            throw new APIError("Fbx not valid","Fbx is not valid.");      
        for(var fbx of fbses){
            result.fbx.push(fbx.path);
        }
        fbses.splice(0,fbses.length);

        var animation = await animationRepository.getAnimationByScene(scene.id);
        if(animation&&animation.id>0){
            result.rotation.speed = animation.rotateSpeed||0;
            result.scale.min_Scale = animation.minScale||1.0;
            result.scale.max_Scale = animation.maxScale||1.0;
            result.scale.speed = animation.scaleSpeed||0;
        }
        animation = null;

        ctx.rest(result);
    }
}