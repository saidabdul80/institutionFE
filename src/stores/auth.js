import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

import { post } from "@/api/client";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in        
    userInfo: useLocalStorage("userInfo", {}),    
    authToken: useLocalStorage("authToken", null),
    route: useLocalStorage("route",{}),
    isLoading:false,
  }),
  getters: {
    getRoute: (state)=>{return state.route}
  },
  persist: true,
  actions: {
    setRoute(route){
      this.route = route
    },
    setStoreToken(token) {
      this.authToken = token;
    },
    async login(username, password, route) {           
      const AuthenticatedUser = await post(route, {
        username: username,
        password: password,
      },false);
      
        if (!AuthenticatedUser) {        
          return false;
        }        
        //this.setStoreToken(AuthenticatedUser.data.access_token)
        this.$state.authToken = AuthenticatedUser.data.accessToken;             
        this.$state.userInfo = AuthenticatedUser.data.staff;             
        return true;       
    },    
    loginPath() { 
      try {
        const currentPath = location.pathname;
      } catch (error) {
        console.error("Error getting current path:", error);
        return null;
      }
          
      const roleSegment = currentPath.split('/')[1]?.toLowerCase();
          
      let loginPath;
      if (roleSegment === 'staff') {
        loginPath = 'staff/login';
      } else if (roleSegment === 'student') {
        loginPath = 'student/login';
      } else {
        loginPath = 'applicant/login'; 
      }
    
      return loginPath;
    },
    async logout(route) {
      //set authToken in pinia state to null
      const res = await post(route?.url);
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
