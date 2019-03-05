var create_vm = new Vue({
    el:"#Hologram-Create",
    data:{
        authorization:localStorage.getItem("authorization"),
        div_width:$("#renderer").length>0?$("#renderer")[0].clientWidth:0,
        div_height:$("#renderer").length>0?$("#renderer")[0].clientHeight:0,
        stats:null, 
        scene:{},
        sceneName:'',
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
            name:"AmbientLight",
            color:'#ffffff',
            intensity:1.0
        },
        directionalLightParam:{
            name:"DirectionalLight",
            color:"#ffffff",
            intensity:1.0
        },
        currentModelFile:'',
        filename_arr:[],
        model_arr:[],
        camera:{},   
        light:[],    
        renderer:{},
        rotateSpeed:0,
        scaleSpeed:0,
        minScale:1,
        maxScale:1,
        currentScale:1,
        scaling:false
    },
    computed:{
        renderer_size:function(){
            return this.div_width>=this.div_height?this.div_height:this.div_width;
        },
        canvasClass:function(){
            return{
                width:this.renderer_size+'px',
                height:this.renderer_size+'px',
                position:'absolute',
                top:(this.div_height-this.renderer_size)/2+'px',
                left:(this.div_width-this.renderer_size)/2+'px'
            };
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
        ambientLightColorR:function(){
            return parseFloat(parseInt('0x'+this.ambientLightParam.color.substr(1,2))/255) ;
        },
        ambientLightColorG:function(){
            return parseFloat(parseInt('0x'+this.ambientLightParam.color.substr(3,2))/255) ;
        },
        ambientLightColorB:function(){
            return parseFloat(parseInt('0x'+this.ambientLightParam.color.substr(5,2))/255) ;
        },
        directionalLightColorR:function(){
            return parseFloat(parseInt('0x'+this.directionalLightParam.color.substr(1,2))/255);
        },
        directionalLightColorG:function(){
            return parseFloat(parseInt('0x'+this.directionalLightParam.color.substr(5,2))/255);
        },
        directionalLightColorB:function(){
            return parseFloat(parseInt('0x'+this.directionalLightParam.color.substr(1,2))/255);
        },
        action:function(){
            if(this.model_arr.length<=0)
                return '放大';
            var model = this.model_arr[0];
            return model.scale.x==this.minScale?"放大":model.scale.x==this.maxScale?"缩小":"缩放中";
        },
        scalable:function(){
            if(this.model_arr.length<=0)
                return false;
            var model = this.model_arr[0];
            return model.scale.x===1||model.scale.x===this.maxScale;
        }   
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
            //this.camera.lookAt(new THREE.Vector3(0,0,0));
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
                this.cameraParam.positionX = parseFloat(value);
            }else if(direction=="y"){
                this.cameraParam.positionY = parseFloat(value);
            }else if(direction=="z"){
                this.cameraParam.positionZ = parseFloat(value);
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
            ambientLight.name=ambientParam.name;
            this.light.push(ambientLight);
            this.scene.add(ambientLight);

            var directionalParam = this.directionalLightParam;
            var directionalLight = new THREE.DirectionalLight(directionalParam.color,directionalParam.intensity);
            directionalLight.name = directionalParam.name;
            directionalLight.castShadow = true;
            this.light.push(directionalLight);
            this.scene.add(directionalLight);
        },
        //修改环境光颜色
        updateAmbientLightColor:function(value){
            this.ambientLightParam.color = value;
            this.scene.getObjectByName(this.ambientLightParam.name).color.r=this.ambientLightColorR;
            this.scene.getObjectByName(this.ambientLightParam.name).color.g=this.ambientLightColorG;
            this.scene.getObjectByName(this.ambientLightParam.name).color.b=this.ambientLightColorBss;
        },
        //修改环境光强度
        updateAmbientLightIntensity:function(value){
            this.ambientLightParam.intensity = parseFloat(value) ;
            this.scene.getObjectByName(this.ambientLightParam.name).intensity=parseFloat(value);
        },
        //修改太阳光颜色
        updateDirectionalLightColor:function(value){
            this.directionalLightParam.color = value;
            this.scene.getObjectByName(this.directionalLightParam.name).color.r=this.directionalLightColorR;
            this.scene.getObjectByName(this.directionalLightParam.name).color.g=this.directionalLightColorG;
            this.scene.getObjectByName(this.directionalLightParam.name).color.b=this.directionalLightColorB;
        },
        //修改太阳光强度
        updateDirectionalLightIntensity:function(value){
            this.directionalLightParam.intensity = parseFloat(value) ;
            this.scene.getObjectByName(this.directionalLightParam.name).intensity=parseFloat(value) ;
        },
        //初始化renderer
        init_Renderer:function(){
            this.renderer = new THREE.WebGLRenderer({canvas:$('canvas')[0],antialias:true});
            this.renderer.setSize(this.renderer_size,this.renderer_size,false);
            console.log("init_Renderer");
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
                        model.name=res.data.filename;
                        model.receiveShadow = true;
                        create_vm.scene.add(model);
                        create_vm.filename_arr.push(res.data);
                        create_vm.model_arr.push(model);
                        create_vm.currentScale = model.scale.x;
                        create_vm.minScale=create_vm.currentScale;
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
            });
        },
        //去除模型
        removeModel(filename){
            //场景中去除
            var model = this.scene.getObjectByName(filename);
            this.scene.remove(model);
            //文件名数组中去除
            var fileIndex = -1;
            for(var i in this.filename_arr){
                if(this.filename_arr[i].filename===filename){
                    fileIndex = i;
                }
            }
            if(fileIndex>=0){
                this.filename_arr.splice(fileIndex,1);
            }
            //模型数组中去除
            var modelIndex = -1;
            for(var i in this.model_arr){
                if(this.model_arr[i].name===filename){
                    modelIndex = i;
                }
            }
            if(modelIndex>=0){
                this.model_arr.splice(modelIndex,1);
            }
            //清空上传文件控件的值
            $("input[type='file']").val('');
        },
        //每一帧的更新
        update(){
            if(this.stats){
                this.stats.update();
            }
            //遍历每一个模型
            for(var model of this.model_arr){
                if(!this.scaling){
                    model.rotation.y += this.rotateSpeed;
                    if(model.rotation.x>0){
                        model.rotation.x-=this.rotateSpeed;
                    }else if(model.rotation.x<0){
                        model.rotation.x+=this.rotateSpeed;
                    }else{
                        model.rotation.x = 0;
                    }
                }
                else{
                    console.log("scaling");
                    //关闭缩放按钮的点击事件                   
                    if(this.currentScale<this.maxScale){
                        if(model.scale.x<this.maxScale){
                            model.scale.x+=this.scaleSpeed;
                            model.scale.y+=this.scaleSpeed;
                            model.scale.z+=this.scaleSpeed;
                            
                        }else{                            
                            model.scale.x=this.maxScale;
                            model.scale.y=this.maxScale;
                            model.scale.z=this.maxScale;
                            this.scaling = !this.scalable
                            this.currentScale = this.maxScale;
                        }
                    }else if(this.currentScale>this.minScale){
                        if(model.scale.x>this.minScale){
                            model.scale.x-=this.scaleSpeed;
                            model.scale.y-=this.scaleSpeed;
                            model.scale.z-=this.scaleSpeed;
                        }else{
                            model.scale.x=this.minScale;
                            model.scale.y=this.minScale;
                            model.scale.z=this.minScale;
                            this.scaling = !this.scalable;
                            this.currentScale = this.minScale;
                        }
                    }
                }
            }
        },
        //渲染图像
        render:function(){
            if(!this.camera.id)
                return;
            for(var view in this.views){
                var camera;
                if(view==='left_view'){
                    camera = this.camera.clone().translateX(-1*this.camera.position.z).translateZ(-1*this.camera.position.z).rotateY(-Math.PI/2).rotateZ(Math.PI/2);
                }else if(view==='back_view'){
                    camera = this.camera.clone().translateZ(-2*this.camera.position.z).rotateY(Math.PI).rotateZ(Math.PI);
                }else if(view==='right_view'){
                    camera = this.camera.clone().translateX(this.camera.position.z).translateZ(-1*this.camera.position.z).rotateY(Math.PI/2).rotateZ(-Math.PI/2);
                }else if(view==='front_view'){
                    camera = this.camera.clone();
                }
                this.renderer.setViewport(this.views[view].x,this.views[view].y,this.views[view].width,this.views[view].height);
                this.renderer.setScissor(this.views[view].x,this.views[view].y,this.views[view].width,this.views[view].height);
                this.renderer.setScissorTest(true);
                this.renderer.setClearColor(new THREE.Color(0x000000));               
                this.renderer.render(this.scene,camera);
            }       
        },
        //循环每一帧
        loop:function(){
            requestAnimationFrame(this.loop);
            this.update();
            this.render();
        },
        //启动缩放
        scale:function(){
            if(this.maxScale<=this.minScale){
                alert("缩放比例必须大于1");
                return;
            }else if(this.scaleSpeed<=0){
                alert("缩放速度必须大于0");
                return;
            }
            this.scaling = true;
        },
        //提交场景信息
        save:function(){ 
            if(this.sceneName==""){
                alert("请输入场景名称。");   
                return;
            }                   
            if(this.filename_arr.length<=0){
                alert("请您导入模型。");
                return;
            }               
            var data = {
                scene:{
                    name:this.sceneName,
                },
                camera:{
                    fov:this.cameraParam.fov,
                    aspect:this.cameraParam.aspect,
                    near:this.cameraParam.near,
                    far:this.cameraParam.far,
                    positionX:this.cameraParam.positionX,
                    positionY:this.cameraParam.positionY,
                    positionZ:this.cameraParam.positionZ,
                    upX:this.cameraParam.upX,
                    upY:this.cameraParam.upY,
                    upZ:this.cameraParam.upZ
                },
                ambientLight:{
                    color: '0x'+this.ambientLightParam.color.substr(1,6),
                    intensity:this.ambientLightParam.intensity,
                },
                directionalLight:{
                    color: '0x'+this.directionalLightParam.color.substr(1,6),
                    intentsity:this.directionalLightParam.intensity,
                },
                animation:{
                    rotateSpeed:this.rotateSpeed,
                    minScale:this.minScale,
                    maxScale:this.maxScale,
                    scaleSpeed:this.scaleSpeed,
                },
                fbses:[]
            };
            for(var file of this.filename_arr){
                data.fbses.push(file.url);
            };
            axios.post("/api/admin/addScene",data,{
                headers:{
                    authorization:this.authorization,
                    contentType:'application/json'
                }
            }).then(function(res){
                console.log(res);
            }).catch(function(err){
                console.error(err.response);
            });
        }
    },
    created:function(){
        this.init_Scene();
        this.init_Camera();
        this.init_Light();       
    },
    mounted:function(){
        this.init_Stats();
        this.init_Renderer();
        this.loop();
    },
});