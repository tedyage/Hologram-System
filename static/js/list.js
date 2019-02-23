var nav_vm = new Vue({
    el:"#nav",
    data:{
        username:''
    },
    methods:{
        isAuthorized:function(){
            var authorization = localStorage.getItem("authorization");
            if(!authorization){
                window.location.href="login.html";
            }
            axios.get("/api/admin/getAuthorization",{params:{authorization:authorization}})
            .then(function(res){
                console.log(res);
                nav_vm.username = res.data.username;
            })
            .catch(function(err){
                console.error(err.response);
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

    },
    methods:{
        
    },
    
})