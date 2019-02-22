var login_vm=new Vue({
    el:"#form",
    data:{
        username:"",
        password:'',
        verificationCode:"",
        verificationImg:"",
        error:{
            username:"",
            password:"",
            verificationCode:""
        },
        valid:true,
    },
    computed:{
        md5_pass:function(){
            return this.password&&this.password!=''? md5(this.password).toUpperCase():'';
        }
    },
    methods:{
        getCheckCode:function(){
            axios.get("/api/admin/getCheckCode")
            .then(function(res){
                login_vm.verificationImg = res.data.img;
            })
            .catch(function(err){
                if(err.response.status===400){
                    console.error(err.response.data.code);
                    alert(err.response.data.message);
                }else{
                    console.error(err.response.data);
                }  
            });
        },
        resetForm:function(){
            this.username="";
            this.password="";
            this.verificationCode="";
            this.getCheckCode();
        },
        resetError:function(){
            this.error.username="";
            this.error.password="";
            this.error.verificationCode="";
        },
        validate:function(){    
            this.resetError();       
            this.valid = true;
            if(this.username==""){
                this.error.username = '请输入用户名。';
                this.valid = false;
            }else if(this.password==""){
                this.error.password = '请输入密码。';
                this.valid = false;
            }else if(this.verificationCode==""){
                this.error.verificationCode = '请输入验证码。';
                this.valid = false;
            }
        },
        submit:function(){
            this.validate();
            if(!this.valid)
                return;
            axios.post('/api/admin/login',{
                username:this.username,
                password:this.md5_pass,
                verificationCode:this.verificationCode,
            }).then(function(res){
                console.log(res)
            }).catch(function(res){
                if(res.response.status==400){
                    var err = res.response.data;
                    console.error(err.code);
                    if(err.code.indexOf('username:')>=0){
                        login_vm.error.username=err.message;
                    }else if(err.code.indexOf('password:')>=0){
                        login_vm.error.password=err.message;
                    }else if(err.code.indexOf('verificationCode:')>=0){
                        login_vm.error.verificationCode=err.message;
                        if(err.code=='verificationCode:invalid')
                        login_vm.verificationCode="";
                        login_vm.getCheckCode();
                    }else{
                        alert(err.message);
                        login_vm.resetForm();
                    }
                }else{
                    console.log(res.response);
                }
            });
        }
    },
    mounted:function(){
        this.getCheckCode();
    }
});