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
});