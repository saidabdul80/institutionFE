import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

import { post } from "@/api/client";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in        
    userInfo: useLocalStorage("userInfo", {}),    
    authToken: useLocalStorage("authToken", null),
    isLoading:false,
  }),
  getters: {},
  persist: true,
  actions: {
    setStoreToken(token) {
      this.authToken = token;
    },
    async login(username, password, route) {          
        const AuthenticatedUser = await post(route.url, {
          username: username,
          password: password,
        },true);
            
        if (AuthenticatedUser.status !== 'success') {        
          return false;
        }

        this.$state.userInfo = AuthenticatedUser.data;             
        return true;       
    },
    
    async logout(route) {
      //set authToken in pinia state to null
      const res = await post(route.url);
      if(res.status==200){

        this.authToken = null;                
        this.userInfo = null;                
        this.$state.authToken = null;        
        localStorage.clear();
        return true
      }
      return false    
    },
  },
});
