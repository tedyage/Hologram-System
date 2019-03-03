var create_vm = new Vue({
    el:"#Hologram-Create",
    data:{
        authorization:localStorage.getItem("authorization"),
        canvasWidth:$("canvas").length>0?$("canvas")[0].clientWidth:0,
        canvasHeight:$("canvas").length>0?$("canvas")[0].clientHeight:0,
        stats:null, 
        scene:{},
        cameraParam:{
            fov:75,
            aspect:1,
            near:0.1,
            far:1000.0,
            positionX:0.0,
            positionY:0.0,
            positionZ:250.0,
            upX:0.0,
            upY:1.0,
            upZ:0.0,
        },
        ambientLightParam:{
            color:'#ffffff',
            intensity:1.0
        },
        directionalLightParam:{
            color:"#ffffff",
            intensity:1.0
        },
        currentModelFile:'',
        filename_arr:[],
        model_arr:[],
        camera:{},   
        light:[],    
        renderer:{},
    },
    computed:{
        renderer_size:function(){
            return this.canvasWidth>=this.canvasHeight?this.canvasHeight:this.canvasWidth;
        },
        views:function(){
            var view_size = this.renderer_size/3.0;
            return {
                left_view:{
                    x:0,
                    y:view_size,
                    width:view_size,
                    height:view_size,                
                },
                back_view:{
                    x:view_size,
                    y:0,
                    width:view_size,
                    height:view_size, 
                },
                right_view:{
                    x:view_size*2,
                    y:view_size,
                    width:view_size,
                    height:view_size, 
                },
                front_view:{
                    x:view_size,
                    y:view_size*2,
                    width:view_size,
                    height:view_size, 
                }
            };
        },
    },
    methods:{
        //初始化stats
        init_Stats:function(){
            this.stats = new Stats();
            $('body').append(this.stats.dom);   
            console.log("init_Stats");
        },
        //初始化Scene
        init_Scene:function(){
            this.scene = new THREE.Scene();
            console.log("init_Scene");
        },
        //初始化摄像头
        init_Camera:function(){
            var param = this.cameraParam;
            this.camera = new THREE.PerspectiveCamera(param.fov,param.aspect,param.near,param.far);
            this.camera.position.x = param.positionX;
            this.camera.position.y = param.positionY;
            this.camera.position.z = param.positionZ;
            this.camera.up.x = param.upX;
            this.camera.up.y = param.upY;
            this.camera.up.z = param.upZ;
            this.camera.lookAt(new THREE.Vector3(0,0,0));
            console.log("init_Camera");
        },
        //更新广角
        updatefov:function(value){
            this.cameraParam.fov = value;
            this.camera.fov = parseInt(this.cameraParam.fov);
        },
        //更新宽高比
        updateaspect:function(value){
            this.cameraParam.aspect = value;
            this.camera.aspect = parseFloat(this.cameraParam.aspect);
        },
        //更新摄像机位置
        updateposition:function(direction, value){
            if(direction=="x"){
                this.cameraParam.positionX = value;
            }else if(direction=="y"){
                this.cameraParam.positionY = value;
            }else if(direction=="z"){
                this.cameraParam.positionZ = value;
            }
            this.camera.position[direction] = parseFloat(value);
        },
        //更新摄像机朝向
        updateup:function(direction, value){
            if(direction=="x"){
                this.cameraParam.upX = value;
            }else if(direction=="y"){
                this.cameraParam.upY = value;
            }else if(direction=="z"){
                this.cameraParam.upZ = value;
            }
            this.camera.up[direction] = parseInt(value);
        },
        //初始化光照
        init_Light:function(){

            var ambientParam = this.ambientLightParam;
            var ambientLight = new THREE.AmbientLight(ambientParam.color,ambientParam.intensity);
            this.light.push(ambientLight);
            this.scene.add(ambientLight);

            var directionalParam = this.directionalLightParam;
            var directionalLight = new THREE.DirectionalLight(directionalParam.color,directionalParam.intensity);
            directionalLight.castShadow = true;
            this.light.push(directionalLight);
            this.scene.add(directionalLight);
        },
        //初始化renderer
        init_Renderer:function(){
            this.renderer = new THREE.WebGLRenderer({canvas:$('canvas')[0],antialias:true});
            this.renderer.setSize(this.renderer_size,this.renderer_size,false);
            console.log("init_Renderer");
        },
        init_Model:function(){
            var loader = new THREE.FBXLoader();
            loader.load("/static/asset/threejs_mars.fbx",function(model){
                console.log(model)
                model.receiveShadow = true;
                create_vm.model_arr.push(model);
                create_vm.scene.add(model);
                create_vm.filename_arr.push("threejs_mars.fbx");
            },function(progress){
                console.log(progress);
            },function(error){
                console.error(error);
            })
        },
        //上传Model
        uploadModel:function(event){          
            var formData = new FormData();
            formData.append("file",event.target.files[0]);
            axios.post("/api/admin/uploadModel",formData,{
                headers:{
                    authorization:this.authorization,
                    "content-type":"multipart/form-data",                    
                }
            }).then(function(res){
                var loader = new THREE.FBXLoader();
                console.log(res.data.url);
                setTimeout(function(){
                    loader.load(res.data.url,function(model){
                        console.log(model)
                        model.receiveShadow = true;
                        create_vm.model_arr.push(model);
                        create_vm.scene.add(model);
                        create_vm.filename_arr.push(res.data);
                    },function(progress){
                        console.log(progress);
                    },function(error){
                        console.error(error);
                    })
                },1000);                              
            }).catch(function(err){      
                console.error(err);         
                if(err.response.status==400){
                    alert(err.response.data.message);
                }
                console.error(err.response.data);
            })
        },
        //渲染图像
        render:function(){
            if(!this.camera.id)
                return;
            // for(var view in this.views){
            //     var camera;
            //     if(view==='left_view'){
            //         camera = this.camera.clone().translateX(-1*this.camera.position.z).translateZ(-1*this.camera.position.z).rotateY(-Math.PI/2).rotateZ(Math.PI/2);
            //     }else if(view==='back_view'){
            //         camera = this.camera.clone().translateZ(-2*this.camera.position.z).rotateY(Math.PI).rotateZ(Math.PI);
            //     }else if(view==='right_view'){
            //         camera = this.camera.clone().translateX(this.camera.position.z).translateZ(-1*this.camera.position.z).rotateY(Math.PI/2).rotateZ(-Math.PI/2);
            //     }else if(view==='front_view'){
            //         camera = this.camera.clone();
            //     }
            //     this.renderer.setViewport(this.views[view].x,this.views[view].y,this.views[view].width,this.views[view].height);
            //     this.renderer.setScissor(this.views[view].x,this.views[view].y,this.views[view].width,this.views[view].height);
            //     this.renderer.setScissorTest(true);
            //     this.renderer.setClearColor(new THREE.Color(0x000000));               
            //     this.renderer.render(this.scene,camera);
            // }      
            this.renderer.render(this.scene,this.camera);    
        },
        loop:function(){
            requestAnimationFrame(this.loop);
            this.render();
        }
    },
    created:function(){
        this.init_Stats();
        this.init_Scene();
        this.init_Camera();
        this.init_Light();
        this.init_Renderer();
        this.init_Model();
    },
    mounted:function(){
        this.loop();
    },
});