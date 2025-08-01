import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

import { post } from "@/api/client";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    userInfo: useLocalStorage("userInfo", {}),
    authToken: useLocalStorage("authToken", null),
    userType: useLocalStorage("userType", null), // staff, student, applicant
    route: useLocalStorage("route",{}),
    isLoading:false,
  }),
  getters: {
    getRoute: (state)=>{return state.route},
    isAuthenticated: (state) => !!state.authToken,
    getUserType: (state) => state.userType,
    getUser: (state) => state.userInfo
  },
  persist: true,
  actions: {
    setRoute(route){
      this.route = route
    },
    setStoreToken(token) {
      this.authToken = token;
    },
    async login(username, password, routeUrl, userType = 'staff') {
      try {
        const AuthenticatedUser = await post(routeUrl, {
          username: username,
          password: password,
        }, false);

        if (!AuthenticatedUser || AuthenticatedUser.error) {
          console.error('Login failed:', AuthenticatedUser);
          return false;
        }

        // Set auth token - ensure it's properly stored
        const token = AuthenticatedUser.data.accessToken;
        this.$state.authToken = token;
        this.$state.userType = userType;

        // Also set in localStorage directly to ensure consistency
        localStorage.setItem('authToken', JSON.stringify(token));
        localStorage.setItem('userType', JSON.stringify(userType));

        // Set user info based on user type
        if (userType === 'staff') {
          this.$state.userInfo = AuthenticatedUser.data.staff;
          localStorage.setItem('userInfo', JSON.stringify(AuthenticatedUser.data.staff));
        } else if (userType === 'student') {
          this.$state.userInfo = AuthenticatedUser.data.student;
          localStorage.setItem('userInfo', JSON.stringify(AuthenticatedUser.data.student));
        } else if (userType === 'applicant') {
          this.$state.userInfo = AuthenticatedUser.data.applicant;
          localStorage.setItem('userInfo', JSON.stringify(AuthenticatedUser.data.applicant));
        }

        console.log('Login successful:', { userType, token: token ? 'present' : 'missing' });
        return true;
      } catch (error) {
        console.error('Login error in auth store:', error);
        return false;
      }
    },
    loginPath() { 
      try {
        const currentPath = location.pathname;
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
      } catch (error) {
        console.error("Error getting current path:", error);
        return null;
      }
    },    
    async logout(route) {
      try {
        // Call logout endpoint if route is provided
        if (route?.url) {
          await post(route.url);
        }
      } catch (error) {
        console.error('Logout API error:', error);
      }

      // Clear all auth data regardless of API response
      this.authToken = null;
      this.userInfo = {};
      this.userType = null;
      this.$state.authToken = null;
      this.$state.userInfo = {};
      this.$state.userType = null;

      // Clear specific auth items from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userType');

      console.log('Logout completed');
      return true;
    },

    // Helper method to get appropriate login route based on current path
    getLoginRoute() {
      const currentPath = location.pathname;
      const roleSegment = currentPath.split('/')[1]?.toLowerCase();

      if (roleSegment === 'staff') {
        return { url: 'api/staff/login', userType: 'staff' };
      } else if (roleSegment === 'student') {
        return { url: 'api/studentportal/login', userType: 'student' };
      } else {
        return { url: 'api/applicants/login', userType: 'applicant' };
      }
    },

    // Helper method to get appropriate logout route
    getLogoutRoute() {
      if (this.userType === 'staff') {
        return { url: 'api/staff/logout' };
      } else if (this.userType === 'student') {
        return { url: 'api/studentportal/logout' };
      } else {
        return { url: 'api/applicants/logout' };
      }
    },
  },
});
