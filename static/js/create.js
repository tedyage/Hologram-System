var create_vm = new Vue({
    el:"#Hologram-Create",
    data:{
        authorization:localStorage.getItem("authorization"),
        canvasWidth:$("canvas")[0].clientWidth,
        canvasHeight:$("canvas")[0].clientHeight,
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
        camera:{},
        renderer:{},
    },
    computed:{
        renderer_size:function(){
            return this.canvasWidth>=this.canvasHeight?this.canvasHeight:this.rendererSize.canvasWidth;
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
        model_arr:function(){

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
        //上传Model
        uploadModel:function(event){
            
            console.log(event.target.files[0]);
            var formData = new FormData();
            formData.append("file",event.target.files[0]);
            axios.post("/api/admin/uploadModel",formData,{
                headers:{
                    authorization:this.authorization,
                    "content-type":"multipart/form-data",                    
                }
            }).then(function(res){
                console.log(res.data);
            }).catch(function(err){               
                if(err.response.status==400){
                    alert(err.response.data.message);
                }
                console.error(err.response.data);
            })
        }
    },
    created:function(){
        this.init_Stats();
        this.init_Scene();
    },
    mounted:function(){

    },
});