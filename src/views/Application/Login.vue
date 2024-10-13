<template>

    <div class=" md:h-[100vh]">
            <div class=" flex justify-center items-start md:items-center h-[100vh] w-full">
                <div
                    class="flex flex-1 flex-col justify-center px-4 border py-12 sm:px-6 lg:flex-none md:px-0">
                    <div class="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <div class="flex justify-center mb-10">
                                <img class="md:h-24 h-20 w-auto" src="@/assets/logo.jpg" alt="Your Company" />
                            </div>
                            <p class="my-6 text-center font-semibold text-[16px] text-green-900">
                                Enter your details to access your account.
                            </p>
                        </div>
                        <div ref="form">
                            <div>
                                <div class="w-[80%] mx-auto" >
                                    <PInput v-model="authStore.loginData.username" label="ID Number"
                                    class="mb-2"
                                    fluid
                                        :error_messages="globalStore.nameRules?.username"
                                        placeholder="Username"  />

                                    <PasswordField label="Password" 
                                    type="password"
                                        placeholder="**********"
                                        fluid
                                        v-model="authStore.loginData.password"
                                        :error_messages="globalStore.nameRules?.password" />
                                </div>
                            </div>
                            <div class="w-[80%] mx-auto" >
                            <div
                                class="flex justify-between w-full my-6  items-center">
                                <div class="text-xs">
                                    <Checkbox label="Remember me" size="small" />
                                    Remember me
                                </div>
                                <div class="">
                                    <Button @click="$router.push('./forgot-password')" outlined link label="Forgot password?" />

                                </div>
                            </div>
                            <div>
                                <Button  :loading="isLoading" @click.prevent="login()" type="submit" fluid size="large" label="Login" >

                                </Button>
                            </div>
                            <p>
                                dont have an acccount? <Button outlined link label="Apply Now?" @click="$router.push('./register')"  />
                            </p>
                            </div>
                            <!-- <p class="mt-3 text-[19px] text-gray-500 text-center">
                                Login as
                                <a @click="$router.push('/vendor/login')"  href="#" style="cursor: pointer"
                                    class="font-semibold text-green-900 hover:text-green-700">
                                    Vendor
                                </a>
                                or
                                <a  @click="$router.push('/individual/login')" style="cursor: pointer"
                                    class="font-semibold text-green-900 hover:text-green-700">
                                    Taxpayer
                                </a>
                                instead.
                            </p> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>


<script>
import { useGlobalsStore } from '@/stores/globals';
//import { useNotificationStore } from '@/stores/notification';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Password from 'primevue/password';
import PInput from '@/components/PInput.vue';
import { useClient } from '@/stores/client';
import PasswordField from '@/components/PasswordField.vue';

export default {
    name: "Login",
    components: {
        InputText,
        PasswordField,
        Button,
        PInput,
        Checkbox,

    },
    data() {
        return {
            isLoading: false,
            showPassword: false,
            //notificationStore: useNotificationStore(),
            authStore:{
                loginData:{}
            },
            globalStore: useGlobalsStore(),
        }
    },
    watch: {

    },
    methods: {
        async login() {
            this.isLoading = true

            const res = await useClient().http({method:'post',path:this.$endpoints.applicant.applicantLoginPost.url, data:this.authStore.loginData})
            this.isLoading = false
        }
    }
};
</script>

<style></style>