import { useAuthStore } from '@/stores/auth';
import { get } from '@/api/client';
import { schoolInfoMixin } from './schoolInfoMixin';

export const userDataMixin = {
  mixins: [schoolInfoMixin],
  data() {
    return {
      isLoadingUserData: false,
      userDataStore: useAuthStore()
    };
  },

  computed: {
    $auth() {
      return this.userDataStore;
    }
  },
  methods: {
    async refreshUserData() {
      if (this.isLoadingUserData || !this.userDataStore.isAuthenticated) {
        return;
      }
      
      this.isLoadingUserData = true;
      
      try {
        let endpoint = '';
        let userKey = '';
        
        // Determine the correct endpoint based on user type
        if (this.userDataStore.userType === 'staff') {
          endpoint = this.$endpoints.staff.login.url;
          userKey = 'staff';
        } else if (this.userDataStore.userType === 'student') {
          endpoint = this.$endpoints.student.studentLoginGet.url;
          userKey = 'student';
        } else if (this.userDataStore.userType === 'applicant') {
          endpoint = this.$endpoints.applicant.applicantSelf.url;
          userKey = 'applicant';
        } else {
          console.warn('Unknown user type:', this.userDataStore.userType);
          return;
        }
        
        // Fetch fresh user data from backend
        const response = await get(endpoint);
        
        if (response && response.data && response.data[userKey]) {
          // Update auth store with fresh user data
          this.userDataStore.$state.userInfo = response.data[userKey];
          
          // Emit event for components to react to user data update
          this.$emit('user-data-updated', response.data[userKey]);
          
          console.log(`${userKey} data refreshed from backend`);
          
          return response.data[userKey];
        } else {
          console.warn('Invalid response structure:', response);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        
        // Handle authentication errors
        if (error.response?.status === 401) {
          console.warn('Authentication failed, logging out user');
          await this.handleAuthenticationError();
        } else if (error.response?.status === 403) {
          console.warn('Access forbidden');
        } else {
          // Network or other errors - don't logout, just log
          console.error('Network or server error:', error.message);
        }
      } finally {
        this.isLoadingUserData = false;
      }
    },
    
    async handleAuthenticationError() {
      try {
        const logoutRoute = this.userDataStore.getLogoutRoute();
        await this.userDataStore.logout(logoutRoute);
        
        // Redirect to appropriate login page
        if (this.userDataStore.userType === 'staff') {
          this.$router.push({ name: 'staff-login' });
        } else if (this.userDataStore.userType === 'student') {
          this.$router.push({ name: 'student-login' });
        } else if (this.userDataStore.userType === 'applicant') {
          this.$router.push({ name: 'applicant-login' });
        } else {
          this.$router.push({ name: 'home' });
        }
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
        // Force logout even if API fails
        this.userDataStore.$state.authToken = null;
        this.userDataStore.$state.userInfo = {};
        this.userDataStore.$state.userType = null;
        localStorage.clear();
        this.$router.push({ name: 'home' });
      }
    },
    
    getCurrentUserData() {
      return this.userDataStore.getUser || {};
    },
    
    isUserDataStale() {
      // Check if user data is older than 5 minutes
      const lastUpdate = localStorage.getItem('userDataLastUpdate');
      if (!lastUpdate) return true;
      
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      return parseInt(lastUpdate) < fiveMinutesAgo;
    },
    
    markUserDataFresh() {
      localStorage.setItem('userDataLastUpdate', Date.now().toString());
    }
  },
  
  async created() {
    // Automatically refresh user data when component is created if it's stale
    if (this.isUserDataStale()) {
      await this.refreshUserData();
      this.markUserDataFresh();
    }
  },
  
  watch: {
    // Watch for route changes and refresh user data
    '$route'(to, from) {
      // Only refresh if we're navigating within the same user type area
      const toSegments = to.path.split('/');
      const fromSegments = from.path.split('/');
      
      if (toSegments[1] === fromSegments[1] && this.isUserDataStale()) {
        this.refreshUserData();
        this.markUserDataFresh();
      }
    }
  }
};

export default userDataMixin;
