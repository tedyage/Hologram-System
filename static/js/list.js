var list_vm=new Vue({
    el:"#HologramList",
    data:{
        authorization:localStorage.getItem("authorization"),
        keyword:'',
        scenes:[],
        pageSize:10,
        pageIndex:1,
        total:0,
        pageTotal:10,
    },
    computed:{
        prevClass:function(){
            return{
                disabled:this.pageIndex<=1
            }            
        },
        nextClass:function(){
            return{
                disabled:this.pageIndex >= Math.ceil(this.total/this.pageSize)
            }
        },
        pageNumArr:function(){
            let arr = [];
            let firstPage = 1, lastPage = Math.ceil(this.total/this.pageSize);
            if(lastPage<=this.pageTotal){
                for(var i = 0;i<lastPage;i++){
                    var page = i+1;
                    arr.push(page);
                }
            }else{
                let firstMiddlePage = Math.ceil(this.pageTotal/2),
                    lastMiddlePage = Math.floor((this.total/this.pageSize + (this.total/this.pageSize-this.pageTotal+1))/2);
                if(firstMiddlePage>=this.pageIndex){
                    for(var i = 0 ; i < this.pageTotal;i++){
                        var page = i+1;
                        arr.push(page);
                    }
                    arr.push(lastPage);
                }else if(lastMiddlePage<=this.pageIndex){
                    arr.push(firstPage);
                    for(var i = 0;i < this.pageTotal; i++){
                        var page = lastPage-this.pageTotal+i+1;
                        arr.push(page);
                    }                   
                }else{
                    arr.push(firstPage);
                    for(var i = 0;i<this.pageTotal;i++){
                        var page = this.pageIndex-5+i+1;
                        arr.push(page);
                    }
                    arr.push(lastPage);
                }
            }
            return arr;                    
        },
        paginationPost:function(){
            return {
                prevClass:this.prevClass,
                nextClass:this.nextClass,
                pageNumArr:this.pageNumArr,
                pageIndex:this.pageIndex,
            }
        },
    },
    methods:{
        getScenesByPagenation:function(){
            axios.get("/api/admin/getScenesByPagination",{params:{
                keyword:this.keyword,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize
            },headers:{
                authorization:this.authorization
            }}).then(function(res){
                console.log(res.data);
                list_vm.scenes = res.data.rows;
                list_vm.total = res.data.count;
            }).catch(function(err){
                console.error(err.response);
            });
        },
        previous:function(){
            this.pageIndex= this.pageIndex-1;
            this.getScenesByPagenation();
        },
        next:function(){
            this.pageIndex = this.pageIndex+1;
            this.getScenesByPagenation();
        },
        switchPage:function(pageIndex){
            this.pageIndex = parseInt(pageIndex);
            this.getScenesByPagenation();
        },
        create:function(){
            window.location.href="create.html";
        }
    },
    mounted:function(){
        this.getScenesByPagenation();
    }
})