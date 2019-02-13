var vm = new Vue({
    el:'#scene',
    data:{
        width:window.innerWidth,
        height:window.innerHeight,
        scene:null,
        lights:[]
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
    },
    created:function(){
        this.init_Scene();
        this.init_Lights();
        console.log(this.scene);
    }
})