var vm = new Vue({
    el:'#canvas',
    data:{
        width:window.innerWidth,
        height:window.innerHeight,
        scene:null,
        lights:[],
        renderer:null,
        fbx_arr:[],
    },
    computed:{
        model_arr:function(){
            var arr= [];
            for(var fbx of fbx_arr){
                var loading = new THREE.FBXLoader();
                loading.load(fbx,function(model){
                    model.receiveShadow = true;
                    arr.push(model);
                    scene.add(model);
                });
            }
        },
        rotate_arr:function(){
            return [];
        },
        scale_arr:function(){
            return [];
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
            var directionalLight = new THREE.DirectionalLight(0xffffff,0.6);
            lights = [ambientLight,directionalLight];
            for(var light of lights){
                if(light)
                    this.scene.add(light);
            }
        },
        init_Renderer:function(){
            //定义渲染器的宽高
            var renderer_width = this.width>=this.height?this.height:this.width;
            renderer_height = renderer_width;
            //初始化渲染器
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(renderer_width,renderer_height,false);
            //初始化画布
            var canvas = this.renderer.domElement;
            canvas.style.position = 'absolute';
            canvas.style.top = (this.height-renderer_height)/2+'px';
            canvas.style.left = (this.width-renderer_width)/2+'px';
            $("#canvas").append(canvas);   
        },
        init_Models:function(){

        }
    },
    created:function(){
        this.init_Scene();
        this.init_Lights();
        this.init_Renderer();
    }
});