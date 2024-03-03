<template>
    <div class="h-100 w-full bg-gray-100 grid md:grid-cols-3 grid-cols-1 h-[100vh]">                    
        <div></div>
        <div class=" flex flex-col justify-center">        
            <h3 class="text-xl text-center shadow-xl text-white font-bold bg-sky-500/70 p-5 rounded-t-full">{{ $globals?.school_info?.school_name }}</h3>
            <Card class="bg-white w-full shadow-xl " :pt="{root:{class:'rounded-t-0 rounded-b-xl'}}">
                <template #title>
                    <div class="flex justify-between">
                    <p>Staff Login</p> 
                        <div class="col-span-1"><img src="@/assets/logo.jpg" class="w-10 rounded-md"></div>
                    </div>
                </template>
                <template #content>
                    <div  class="">                    
                        <div class="mb-1">
                            <FloatLabel>
                                <label for="username">Username</label>
                                <InputText :class="validationErrors.username?'border border-[red]/50':''" id="username" v-model="user.username" class="w-full" />
                            </FloatLabel>
                            <div  class="h-[19px] text-red-500 text-sm">{{ validationErrors.username }}</div>
                        </div>    
                        <div class="mb-1">
                            <FloatLabel>
                                <label for="password">Password</label>
                                <InputText :class="validationErrors.password?'border border-[red]/50':''" id="password" v-model="user.password" type="password" class="w-full" />
                            </FloatLabel>
                            <div  class="h-[19px] text-red-500 text-sm">{{ validationErrors.password }}</div>
                        </div>
                        <Button @click="handleLogin" label="Login" class="mt-4 w-full" />
                    </div>
                </template>
            </Card> 
        </div>
        <div></div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Card from 'primevue/Card';
//import { post } from '@/api/client';
//import { showModal } from '@/plugins/modal';
import { useAuthStore } from '@/stores/auth';

export default {
    components: {
        Button,
        InputText,
        Card,
        FloatLabel
    },
    data() { 
        return {
            user: {
                username: '',
                password: ''
            },
            validationErrors: {},
            store:useAuthStore()
        }
    },
    methods: {
        async handleLogin() {
            this.validationErrors = {}; // Reset validation errors            
            // Basic front-end validation
            if (this.user.username == '') {
                this.validationErrors.username = "Username is required.";
            }

            if (this.user.password=='') {
                this.validationErrors.password = "Password is required.";
            }
            
            if (Object.keys(this.validationErrors).length === 0) {                
                //console.log("Logging in:", this.user);            
                this.$globals.loading = true    
                //alert(this.$endpoints.staff.login.url)
                const res  = await this.store.login(this.user.username, this.user.password,this.$endpoints.staff.login.url)
                this.$globals.loading = false
               //const res =  await post(, this.user)
               //console.log(res);
               if(res){
                this.$router.push('/staff/')
                //showModal({text:res.data});
               }
            }
        },
    },
}
</script>

<style scoped>
.text-red-500 {
    color: #f87171;
}
.text-sm {
    font-size: 0.875rem;
}
</style>
