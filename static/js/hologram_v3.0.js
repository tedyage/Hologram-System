var ScreenPosition = function(x,y){
    this.x=x;
    this.y=y;
};

var DeltaAngle = function(x,y){
    this.x=x;
    this.y=y;
};

var hologram_vm = new Vue({
    el:'#canvas',
    data:{
        width: window.innerWidth,
        height: window.innerHeight,       
        stats:null, 
        scene:{},
        renderer:{},
        camera:{},
        lights:{
            ambient_lights:[],
            directional_lights:[],
            hemisphere_lights:[],
            point_lights:[],
            rectarea_lights:[],
            spot_lights:[]
        },               
        model_arr:[],   
        rotate_arr:[],
        scale_arr:[], 
        rotateSpeed:0, 
        scaleSpeed:0, 
        touchdown:false,
        timeout:0,
        touch1:new ScreenPosition(0,0),
        touch2:new ScreenPosition(0,0),
        rotateScale:1.0, 
        min_Scale:1.0,
        max_Scale:1.0,
        touch_status:'',       
    },
    computed:{        
        renderer_size:function(){
            return this.width>=this.height?this.height:this.width;
        },
        canvasStyle:function(){
            return {
                width:this.renderer_size+'px',
                height:this.renderer_size+'px',
                position:'absolute',
                top:(this.height-this.renderer_size)/2+'px',
                left:(this.width-this.renderer_size)/2+'px'
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
        touchDistance:function(){
            return Math.sqrt(Math.pow(this.touch1.x-this.touch2.x,2)+Math.pow(this.touch1.y-this.touch2.y,2));
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
        //初始化场景数据
        init_data:function(){
            this.$resource('/api/getdata').get()
            .then(function(res){
                if(res.status === 200){
                    //初始化摄像机
                    this.init_Camera(res.body.camera);
                    //初始化光照
                    this.init_Lights(res.body.lights);
                    //初始化fbx数组
                    this.init_Models(res.body.fbx);
                    //初始化旋转速度
                    this.rotateSpeed = res.body.rotation.speed||this.rotateSpeed;
                    //初始化缩放参数
                    this.scaleSpeed = res.body.scale.speed||this.scaleSpeed;
                    this.min_Scale = res.body.scale.min_scale||this.min_Scale;
                    this.max_Scale = res.body.scale.max_Scale||this.max_Scale;
                }else if(res.status === 400){
                    alert(res.body.code);
                }
            },function(err){
                console.error(err);
                alert("error");
            });
        },
        //初始化摄像机
        init_Camera:function(data){
            this.camera = new THREE.PerspectiveCamera(data.fov,data.aspect,data.near,data.far);
            this.camera.position.fromArray(data.position);
            this.camera.up.fromArray(data.up);
            console.log("init_Camera");
        },
        //初始化光照
        init_Lights:function(data){
            //console.log(data);
            for(var light in data){
                if(data[light]&&data[light].length>0){
                    if(light=="ambientLight"){                       
                        var ambientLight = new THREE.AmbientLight(data[light].color,data[light].intensity);
                        this.lights.ambient_lights.push(ambientLight);
                        this.scene.add(ambientLight);
                    }else if(light=="directionalLight"){
                        var directionalLight = new THREE.DirectionalLight(data[light].color,data[light].intensity);
                        directionalLight.castShadow = true;
                        this.lights.directional_lights.push(directionalLight);
                        this.scene.add(directionalLight);
                    }
                }
            }
            console.log("init_Lights");
        },    
        //初始化渲染器
        init_Renderer:function(){
            //初始化渲染器
            this.renderer = new THREE.WebGLRenderer({canvas:$('canvas')[0],antialias:true});
            this.renderer.setSize(this.renderer_size,this.renderer_size,false);                               
            console.log("init_Renderer")
        },
        //初始化模型
        init_Models:function(data){
            for(var fbx of data){
                var loader = new THREE.FBXLoader();
                loader.load(fbx,function(model){                   
                    model.receiveShadow = true;                   
                    hologram_vm.scene.add(model);
                    hologram_vm.model_arr.push(model);
                    hologram_vm.rotate_arr.push(model.rotation);
                    hologram_vm.scale_arr.push(model.scale.x);
                });
            }
            console.log("init_Models");
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
        //更新图像
        update:function(){
            if(this.stats){
                this.stats.update();
            }           
            if(this.touchdown)
                return;
            for(var model of this.model_arr){
                model.rotation.y += this.rotateSpeed;
                if(model.rotation.x>0){
                    model.rotation.x-=this.rotateSpeed;
                }else if(model.rotation.x<0){
                    model.rotation.x+=this.rotateSpeed;
                }else{
                    model.rotation.x = 0;
                }

                if(model.scale.x>this.min_Scale){
                    model.scale.x-=this.scaleSpeed;
                    model.scale.y-=this.scaleSpeed;
                    model.scale.z-=this.scaleSpeed;
                }else if(model.scale.x<this.min_Scale){
                    model.scale.x+=this.scaleSpeed;
                    model.scale.y+=this.scaleSpeed;
                    model.scale.z+=this.scaleSpeed;
                }else{
                    model.scale.x = this.min_Scale;
                }
            }
        },
        //计算转动角度
        getDeltaAngle:function(targetTouch){
            if(!targetTouch){               
                return new DeltaAngle(0,0);
            }
            //计算控制层宽高
            var controlDiv_width = $("#control")[0].clientWidth;
            var controlDiv_height = $("#control")[0].clientHeight;
            //获取每帧移动在x轴和y轴的角度差
            var angle_x = (targetTouch.pageY - this.touch1.y)/controlDiv_height*Math.PI*this.rotateScale;
            var angle_y = (targetTouch.pageX - this.touch1.x)/controlDiv_width*Math.PI*this.rotateScale;
            return new DeltaAngle(angle_x,angle_y);           
        },
        //物体转动方法
        rotateModels:function(model,startRotation,deltaAngle){
            //物体围绕x轴转动deltaAngle.x的角度
            model.rotation.x = startRotation.x + deltaAngle.x;
            //物体围绕y轴转动deltaAngle.y的角度
            model.rotation.y = startRotation.y + deltaAngle.y;
            //物体围绕x轴转动角度限制在-Math.PI/2到Math.PI/2之间
            if(model.rotation.x>=Math.PI/2){
                model.rotation.x=Math.PI/2;
            }else if(model.rotation.x<=-Math.PI/2){
                model.rotation.x=-Math.PI/2;
            }
        },
        //计算当前两个触碰点之间的距离
        getCurrentDistance:function(targetTouches){
            return Math.sqrt(Math.pow(targetTouches[0].pageX-targetTouches[1].pageX,2)+Math.pow(targetTouches[0].pageY-targetTouches[1].pageY,2));
        },
        //缩放物体
        scaleModels:function(model,currentScale){
            model.scale.x = currentScale;
            model.scale.y = currentScale;
            model.scale.z = currentScale;
            if(model.scale.x<= this.min_Scale){
                model.scale.x = this.min_Scale;
                model.scale.y = this.min_Scale;
                model.scale.z = this.min_Scale;
            }
            if(model.scale.x>=this.max_Scale){
                model.scale.x = this.max_Scale;
                model.scale.y = this.max_Scale;
                model.scale.z = this.max_Scale;
            }
        },
        //触碰开始
        touchstart:function(event){
            //终止倒计时
            if(this.timeout>0){
                clearTimeout(this.timeout);
            }
            this.touchdown = true;  //开始触碰，touchdown为true
            var targetTouches = event.targetTouches;
            //排除无接触与三只手指以上接触的。
            if(targetTouches === null|| targetTouches.length<=0||targetTouches.length>2)
                return;
            //单手指
            if(targetTouches.length==1){
                this.touch1=new ScreenPosition(targetTouches[0].pageX,targetTouches[0].pageY);  //获取当前触碰屏幕的坐标X/Y
                for(var i in this.rotate_arr){
                    this.rotate_arr[i] = this.model_arr[i].rotation;
                }
            }else if(targetTouches.length==2){
                //获取当前触碰屏幕的坐标X/Y
                this.touch1 = new ScreenPosition(targetTouches[0].pageX,targetTouches[0].pageY);  
                this.touch2 = new ScreenPosition(targetTouches[1].pageX,targetTouches[1].pageY);
                for(var i in this.scale_arr){
                    this.scale_arr[i] = this.model_arr[i].scale.x;
                }
            }
            this.touch_status = "touchstart";
        },
        touchmove:function(event){
            if(!this.touchdown)
                return;
            var targetTouches = event.targetTouches;
            //排除无接触与三只手指以上接触的。
            if(targetTouches === null || targetTouches.length<=0 || targetTouches.length>2)
                return;
            //单手指
            if(targetTouches.length==1){
                //计算转动的角度
                var deltaAngle = this.getDeltaAngle(targetTouches[0]);
                for(var i in this.model_arr){
                    //旋转物体
                    this.rotateModels(this.model_arr[i],this.rotate_arr[i],deltaAngle);
                    //刷新rotate_arr内的数据
                    this.rotate_arr[i] = this.model_arr[i].rotation;
                }
                this.touch1 = new ScreenPosition(targetTouches[0].pageX,targetTouches[0].pageY);
            }else if(targetTouches.length==2){
                //计算当前两个触碰点之间的距离
                var currentDistance = this.getCurrentDistance(targetTouches);               
                for(var i in this.model_arr){
                    var currentScale = currentDistance/this.touchDistance*this.scale_arr[i];
                    this.scaleModels(this.model_arr[i],currentScale);
                    this.scale_arr[i] = currentScale;
                }
                //获取当前触碰屏幕的坐标X/Y
                this.touch1 = new ScreenPosition(targetTouches[0].pageX,targetTouches[0].pageY);  
                this.touch2 = new ScreenPosition(targetTouches[1].pageX,targetTouches[1].pageY);
            }
            this.touch_status = "touchmove";
        },
        touchend:function(event){            
            var touches = event.touches;
            //排除无接触与三只手指以上接触的。
            if(touches === null || touches.length<0 || touches.length>1)
                return;
            if(touches.length === 1){
                this.touch1 = new ScreenPosition(touches[0].pageX,touches[0].pageY);
                return;
            }
            this.timeout = setTimeout(function(){               
                hologram_vm.touchdown = false;   
            },3000);   
            
            this.touch_status="touchend";
        },
    },
    created:function(){
        console.log("The data is bounded to vm...");           
        this.init_Scene();   
        this.init_data();       
    },
    mounted:function(){
        console.log("The content of $el has loaded in the dom element...");   
        this.init_Stats(); 
        this.init_Renderer();                  
    }
});

window.onresize = function(){
    hologram_vm.width = window.innerWidth;
    hologram_vm.height = window.innerHeight;
}