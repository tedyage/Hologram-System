Vue.component('form-label',{
    props:["forInput","name"],
    template:`<label v-bind:for="forInput" class="col-form-label" v-html="name"></label>`
});

Vue.component('form-input',{
    props:{
        type:String,
        name:String,
        value:[String,Number],
        placeholder:String,
        required:Boolean
    },
    template:`<input :type="type" :id="name" :name="name" :value="value" @input="$emit('input',$event.target.value)" :placeholder="placeholder" class="form-control" :required="required"/>`
});

Vue.component('nav-component',{
    props:{
        username:String
    },
    template:`<header id="nav">           
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <div class="navbar-header">
                <a class='navbar-brand' href='#'>Hologram</a>
            </div> 
            <div class="collapse navbar-collapse" >
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6">
                            <a class="menu" href="list.html">Home<span class="sr-only">(current)</span></a>
                        </div>
                        <div class="col-md-3">
                            <span style="color:#fff">Welcome! {{username}}</span>
                        </div>
                        <div class="col-md-3">
                            <a class="menu" href="login.html">Logout</a>
                        </div>
                    </div>
                </div>
            </div>              
        </div>                      
    </nav>         
</header>`
});

Vue.component('Pagination',{
    props:{
        post:Object,
    },
    template:`<ul class="pagination justify-content-center">                        
    <li class="page-item" :class="post.prevClass">
        <a class="page-link" href="javascript:void(0);" aria-label="Previous" @click.prevent="$emit('prevhandler');">Previous</a>
    </li>
    <li v-for="page in post.pageNumArr" class="page-item" :class='{active:page==post.pageIndex}'>
        <a class="page-link" href="javascript:void(0);" @click.prevent="$emit('pagehandler',page)">{{page}}<span v-if="page==post.pageIndex" class="sr-only">(current)</span></a>
    </li>
    <li class="page-item" :class='post.nextClass'>
        <a class="page-link" href="javascript:void(0);" aria-label="Next" @click.prevent="$emit('nexthandler')">Next</a>
    </li>
</ul>`
});