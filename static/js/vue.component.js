Vue.component('form-label',{
    props:["forInput","name"],
    template:`<label v-bind:for="forInput" class="col-form-label" v-html="name"></label>`
});

Vue.component('form-input',{
    props:{
        type:String,
        name:String,
        value:String,
        placeholder:String,
        required:Boolean
    },
    template:`<input :type="type" :id="name" :name="name" :value="value" @input="$emit('input',$event.target.value)" :placeholder="placeholder" class="form-control" :required="required"/>`
})