<template>
    <div class="h-full flex flex-col bg-gradient-to-b from-purple-600 to-indigo-700">
        <!-- Header Section -->
        <div class="flex-shrink-0 p-4 border-b border-white/10">
          <div class="flex items-center justify-center mb-4">
            <div class="mr-3">
              <img src="@/assets/logo.jpg" class="w-10 h-10 rounded-full object-cover shadow-lg">
            </div>
            <div class="text-white">
              <p class="text-sm font-bold leading-tight">{{ $globals.school_info?.name || 'Institution' }}</p>
              <p class="text-xs opacity-75 leading-tight">Application Portal</p>
            </div>
          </div>
          
          <!-- User Profile Section -->
          <div class="flex flex-col items-center">
            <div class="relative mb-3">
              <div class="rounded-full flex justify-center items-center w-16 h-16 bg-white/20 border-2 border-white/30 backdrop-blur-sm">
                <img v-if="userInfo.picture" :src="userInfo.picture" 
                     class="w-full h-full rounded-full object-cover" 
                     :alt="userInfo.first_name">
                <span v-else class="font-bold text-2xl text-white">
                  {{ getInitials(userInfo.first_name, userInfo.last_name) }}
                </span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div class="text-center">
              <p class="font-bold text-white text-sm leading-tight">
                {{ userInfo.first_name }} {{ userInfo.last_name }}
              </p>
              <p class="text-xs text-white/70 leading-tight">{{ userInfo.email }}</p>
              <p class="text-xs text-white/50 leading-tight mt-1">
                ID: {{ userInfo.application_id || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1 overflow-y-auto py-4">
          <nav class="px-3">
            <ul class="space-y-2">
              <li v-for="(menuItem, i) in menuItems" :key="i">
                <button @click="selectMenu(menuItem.route)" 
                        :class="[
                          'w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200',
                          $route.name === menuItem.route 
                            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        ]">
                  <i :class="menuItem.icon" class="text-lg mr-3 w-5 text-center"></i>
                  <span class="font-medium">{{ menuItem.label }}</span>
                  <i v-if="$route.name === menuItem.route" class="fa fa-chevron-right ml-auto text-sm"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Footer Section -->
        <div class="flex-shrink-0 p-4 border-t border-white/10">
          <div class="space-y-2">
            <!-- Application Status -->
            <div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs text-white/70">Application Status</span>
                <span :class="getStatusColor(userInfo.status)" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ userInfo.status || 'Pending' }}
                </span>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="flex space-x-2">
              <button @click="$router.push({name: 'applicant-profile'})" 
                      class="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-3 rounded-lg transition-colors">
                <i class="fa fa-user mr-1"></i>Profile
              </button>
              <button @click="logout" 
                      class="flex-1 bg-red-500/20 hover:bg-red-500/30 text-white text-xs py-2 px-3 rounded-lg transition-colors">
                <i class="fa fa-sign-out mr-1"></i>Logout
              </button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'ApplicationSideBar',
  emits: ['navigate'],
  data() {
    return {
      authStore: useAuthStore(),
      menuItems: [
        { 
          label: 'Dashboard', 
          route: 'applicant-index',
          icon: 'fa fa-tachometer'
        },
        { 
          label: 'My Application', 
          route: 'applicant-application',
          icon: 'fa fa-file-text'
        },
        { 
          label: 'Documents', 
          route: 'applicant-documents',
          icon: 'fa fa-folder'
        },
        { 
          label: 'Payments', 
          route: 'applicant-payments',
          icon: 'fa fa-credit-card'
        },
        { 
          label: 'Profile', 
          route: 'applicant-profile',
          icon: 'fa fa-user'
        }
      ]
    }
  },
  computed: {
    userInfo() {
      return this.authStore.getUser || {};
    }
  },
  methods: {
    selectMenu(routeName) {
      if (routeName && this.$route.name !== routeName) {
        this.$router.push({ name: routeName }).catch(err => {
          console.error('Navigation error:', err);
        });
        this.$emit('navigate', routeName);
      }
    },
    getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : '';
      const last = lastName ? lastName.charAt(0).toUpperCase() : '';
      return first + last || 'A';
    },
    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-400/20 text-yellow-300',
        'approved': 'bg-green-400/20 text-green-300',
        'rejected': 'bg-red-400/20 text-red-300',
        'under_review': 'bg-blue-400/20 text-blue-300'
      };
      return colors[status?.toLowerCase()] || 'bg-gray-400/20 text-gray-300';
    },
    async logout() {
      try {
        const logoutRoute = this.authStore.getLogoutRoute();
        await this.authStore.logout(logoutRoute);
        this.$router.push({ name: 'home' });
      } catch (error) {
        console.error('Logout error:', error);
        // Force logout even if API fails
        this.authStore.$state.authToken = null;
        this.authStore.$state.userInfo = {};
        this.authStore.$state.userType = null;
        localStorage.clear();
        this.$router.push({ name: 'home' });
      }
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for navigation */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Smooth transitions */
button {
  transition: all 0.2s ease-in-out;
}

/* Active menu item glow effect */
button.bg-white\/20 {
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}
</style>
