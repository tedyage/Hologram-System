var vm = new Vue({
    el:'#canvas',
    data:{
        width: window.innerWidth,
        height:window.innerHeight,        
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
        views:{
            left_view:{
                x:0,
                y:0,
                width:0,
                height:0,                
            },
            back_view:{
                x:0,
                y:0,
                width:0,
                height:0, 
            },
            right_view:{
                x:0,
                y:0,
                width:0,
                height:0, 
            },
            front_view:{
                x:0,
                y:0,
                width:0,
                height:0, 
            }
        },
        fbx_arr:[],
        model_arr:[],   
        rotate_arr:[],
        scale_arr:[],   
    },
    computed:{
        renderer_size:function(){
            return this.width>=this.height?this.height:this.width;
        },
    },
    methods:{
        //初始化Scene
        init_Scene:function(){
            this.scene = new THREE.Scene();
        },
        //初始化光照
        init_Lights:function(){
            var ambientLight = new THREE.AmbientLight(0xf0f0f0,1.0);
            this.lights.ambient_lights.push(ambientLight);
            var directionalLight = new THREE.DirectionalLight(0xffffff,0.6);
            directionalLight.castShadow = true;
            this.lights.directional_lights.push(directionalLight);
        },
        //将光照加入到场景中
        load_Lights:function(){
            for(var light in this.lights){
                if(this.lights[light]&&this.lights[light].length>0){
                    for(var item of this.lights[light]){
                        this.scene.add(item);
                    }
                }
            }
        },
        //初始化摄像机
        init_Camera:function(angle,ratio,nearest,farthest,position,up){
            this.camera = new THREE.PerspectiveCamera(angle,ratio,nearest,farthest);
            this.camera.position.fromArray(position);
            this.camera.up.fromArray(up);
        },
        //初始化渲染器
        init_Renderer:function(){
            //初始化渲染器
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(this.renderer_size,this.renderer_size,false);            
            //初始化画布
            var canvas = this.renderer.domElement;
            canvas.style.position = 'absolute';
            canvas.style.top = (this.height-this.renderer_size)/2+'px';
            canvas.style.left = (this.width-this.renderer_size)/2+'px';
            $("#canvas").append(canvas);   
        },
        //初始化输出视口数组
        init_Views:function(x,y){
            var view_size = this.renderer_size/3.0;
            for(var view in this.views){
                if(view==='left_view'){
                    this.views[view]={
                        x:0,
                        y:view_size,
                        width:view_size,
                        height:view_size,
                    }
                }else if(view==='back_view'){
                    this.views[view]={
                        x:view_size,
                        y:0,
                        width:view_size,
                        height:view_size,
                    }
                }else if(view==='right_view'){
                    this.views[view]={
                        x:view_size*2,
                        y:view_size,
                        width:view_size,
                        height:view_size,
                    }
                }else if(view==='front_view'){
                    this.views[view]={
                        x:view_size,
                        y:view_size*2,
                        width:view_size,
                        height:view_size
                    }
                }
            }
        },
        //初始化fbx数组
        init_Fbx:function(){
            this.fbx_arr=["/static/asset/threejs_mars.fbx","/static/asset/threejs_marscloud.fbx"];
        },
        //载入模型
        load_Models:function(){
            var loader = new THREE.FBXLoader();
            for(var fbx of this.fbx_arr){
                loader.load(fbx,function(model){                   
                    model.receiveShadow = true;
                    console.log(model);
                    vm.scene.add(model),
                    vm.model_arr.push(model),
                    vm.rotate_arr.push(model.rotation);
                    vm.scale_arr.push(model.scale.x);
                });
            }
        },
        //测试生成模型
        test_model:function(){
            var cube = new THREE.Mesh(
                new THREE.BoxGeometry(1,1,1),
                new THREE.MeshBasicMaterial({color:0x00ff00})
            );
            this.scene.add(cube);
        },
        //渲染图像
        render:function(){
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
        //测试渲染
        renderTest:function(){
            this.renderer.render(this.scene,this.camera);
        },
        //每一帧执行方法
        gameloop:function(){
            requestAnimationFrame(this.gameloop);
            this.render();
        }
    },
    created:function(){
        console.log("The data is bounded to vm...");    
        this.init_Scene();    
        this.init_Camera(75,1.0,0.1,1000.0,[0.0,0.0,250.0],[0.0,1.0,0.0]);
        this.init_Lights();
        this.load_Lights();
        this.init_Renderer();
        this.init_Views();
        this.init_Fbx();
        this.load_Models();
        //this.test_model();
        this.gameloop();
    },
    mounted:function(){
        console.log("The content of $el has loaded in the dom element...");   
        
    }
});
