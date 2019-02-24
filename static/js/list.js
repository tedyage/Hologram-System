var nav_vm = new Vue({
    el:"#nav",
    data:{
        username:'',
        authorization:localStorage.getItem("authorization")
    },
    methods:{
        isAuthorized:function(){
            if(!this.authorization){
                window.location.href="login.html";
            }
            axios.get("/api/admin/getAuthorization",{headers:{authorization:this.authorization}})
            .then(function(res){
                nav_vm.username = res.data.username;
            })
            .catch(function(err){
                console.error(err.response);
                window.location.href="login.html";
            });
        }
    },
    created:function(){
        this.isAuthorized();
    }
})

var list_vm=new Vue({
    el:"#HologramList",
    data:{
        authorization:localStorage.getItem("authorization"),
        keyword:'',
        scenes:[],
        pageSize:10,
        pageIndex:1,
    },
    methods:{
        getScenesByPagenation:function(){
            axios.get("/api/admin/getScenesByPagenation",{params:{
                keyword:this.keyword,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize
            },headers:{
                authorization:this.authorization
            }}).then(function(res){
                console.log(res.data);
                list_vm.scenes = res.data.rows;
            }).catch(function(err){
                console.error(err.response);
            });
        }
    },
    mounted:function(){
        this.getScenesByPagenation();
    }
})