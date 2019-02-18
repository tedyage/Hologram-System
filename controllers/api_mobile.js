var hologram = {
    camera:{
        fov:75,
        aspect:1,
        near:0.1,
        far:1000,
        position:[0.0,0.0,250.0],
        up:[0,1,0]
    },
    light:{
        ambientLight:[{
            color:'0xf0f0f0',
            intensity:1.0
        }],
        directionalLight:[{
            color:'0xffffff',
            intensity:0.6
        }]
    },
    fbx:["/static/asset/threejs_mars.fbx", "/static/asset/threejs_marscloud.fbx"],
    rotation:{
        speed:0.01
    },
    scale:{
        speed:0.01,
        min_scale:1.0,
        max_scale:1.5
    }
};

module.exports={
    "GET /api/GetData": async(ctx,next)=>{
        ctx.rest(hologram);
    }
}