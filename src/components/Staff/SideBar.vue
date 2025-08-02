<template>
   
  <div
    :class="{
      'translate-x-0 w-72': sidebarOpen,
      '-translate-x-full w-0': !sidebarOpen
    }"
    class="fixed md:relative h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-30 transition-all duration-300 ease-in-out overflow-hidden"
  >
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6">
      <div class="flex items-center space-x-3" >
        <div class="flex-shrink-0">
          <img src="@/assets/logo.jpg" class="w-12 h-12 rounded-xl shadow-lg border-2 border-white/20">
        </div>
        <div class="flex-1 min-w-0">
          <div
            class="cursor-pointer group"
            @click="showSessionModal=true"
          >
            <p class="text-white font-semibold text-sm mb-1 group-hover:text-blue-200 transition-colors">
              {{ currentSession || '2022/2023' }}
            </p>
            <p class="text-blue-200 text-xs group-hover:text-white transition-colors">
              {{ currentSemester || 'First Semester' }}
            </p>
          </div>
        </div>
        <div class="flex-shrink-0">
          <i class="fas fa-calendar-alt text-white/70 text-lg"></i>
        </div>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="bg-slate-800/50 px-4 py-4 border-b border-slate-700 user-menu-container">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {{ getUserInitials() }}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-medium text-sm truncate">
            {{ getUserName() }}
          </p>
          <p class="text-slate-400 text-xs truncate">
            Staff Portal
          </p>
        </div>
        <div class="flex-shrink-0">
          <button
            @click="showUserMenu = !showUserMenu"
            class="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
          >
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <!-- User Menu Dropdown -->
      <div v-if="showUserMenu" class="mt-3 bg-slate-700 rounded-lg shadow-lg overflow-hidden">
        <a href="#" @click="viewProfile" class="flex items-center px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors">
          <i class="fas fa-user mr-3"></i>
          View Profile
        </a>
        <a href="#" @click="changePassword" class="flex items-center px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors">
          <i class="fas fa-key mr-3"></i>
          Change Password
        </a>
        <div class="border-t border-slate-600"></div>
        <a href="#" @click="logout" class="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors">
          <i class="fas fa-sign-out-alt mr-3"></i>
          Logout
        </a>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto py-4 h-[74vh] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
      <nav class="px-2">
        <div v-for="(menuItem, i) in menuItems" :key="i" class="mb-1">
          <div
            @click="selectMenu($event, menuItem.route, menuItem)"
            class="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-slate-700/50 cursor-pointer"
            :class="{
              'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg': isActiveRoute(menuItem.route),
              'text-slate-300 hover:text-white': !isActiveRoute(menuItem.route)
            }"
          >
            <div class="flex items-center flex-1">
              <i
                :class="[
                  menuItem.icon,
                  'text-lg mr-3',
                  {
                    'text-white': isActiveRoute(menuItem.route),
                    'text-slate-400 group-hover:text-white': !isActiveRoute(menuItem.route)
                  }
                ]"
              ></i>
              <span class="truncate">{{ menuItem.label }}</span>
            </div>
            <i
              v-if="menuItem.children.length"
              class="fas fa-chevron-right text-xs transition-transform duration-200 ml-2"
              :class="{
                'transform rotate-90': isMenuOpen(menuItem),
                'text-white': isActiveRoute(menuItem.route),
                'text-slate-400 group-hover:text-white': !isActiveRoute(menuItem.route)
              }"
            ></i>
          </div>

          <!-- Submenu -->
          <div
            v-if="menuItem.children.length"
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="{
              'max-h-0 opacity-0': !isMenuOpen(menuItem),
              'max-h-[500px] opacity-100': isMenuOpen(menuItem)
            }"
          >
            <div class="mt-1 ml-6 border-l-2 border-slate-700 pl-4 space-y-1">
              <div
                v-for="(subMenu, index) in menuItem.children"
                :key="`subMenu-${index}`"
                @click="navigateTo(subMenu)"
                class="group flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 hover:bg-slate-700/30 cursor-pointer"
                :class="{
                  'bg-slate-700 text-white': isActiveSubRoute(subMenu.route),
                  'text-slate-400 hover:text-white': !isActiveSubRoute(subMenu.route)
                }"
              >
                <i class="fas fa-circle text-xs mr-3 opacity-50"></i>
                <span class="truncate">{{ subMenu.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Footer Section -->
    <div class="bg-slate-800/50 px-4 py-3 border-t border-slate-700">
      <div class="flex items-center justify-between text-xs text-slate-400">
        <span>Staff Portal v2.0</span>
        <span>{{ getCurrentTime() }}</span>
      </div>
    </div>

    <!-- Toggle Button -->
   
    
    <Transition name="fade" mode="out-in">
      <div v-if="showSessionModal">
        <SessionModal 
          :sessions="sessions" 
          @on-close="showSessionModal=false" 
          class="fixed bg-black/50 top-0 left-0 right-0 z-50 w-full p-4 min-h-screen" 
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import SessionModal from '@/components/SessionModal.vue'
import { useAuthStore } from '@/stores/auth';
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';

export default {
  name: 'SidebarDrawer',
  mixins: [schoolInfoMixin],
  components: {
    SessionModal
  },
  data() {
    return {
      showSessionModal: false,
      showUserMenu: false,
      openMenus: [],
      currentTime: '',
      isNavigating: false, // Prevent double clicks
      menuItems: [
        {
          label: 'Dashboard',
          route: 'staff-dashboard',
          icon: 'fa fa-tachometer',
          children:[]
        },
        {
          label: 'Applicants',
          route: 'sub',
          icon: 'fa fa-address-book',
          children:[
            {label:'Dashboard', route:'/staff/applicants/dashboard'},
            {label:'All Applicants', route:'/staff/applicants'},
            {label:'UTME Candidates', route:'/staff/applicants/import'},
            {label:'Admission Management', route:'/staff/applicants/admission'},
            {label:'Qualified/Not Qualified', route:'/staff/applicants/qualification'},
          ]
        },
        {
          label: 'Students',
          route: 'sub',
          icon: 'fa fa-graduation-cap',
          children:[
            {label:'All Students', route:'/staff/students'},
            {label:'Student Registration', route:'/staff/students/registration'},
            {label:'Student Promotion', route:'/staff/students/promotion'},
            {label:'Student Status', route:'/staff/students/status'},
          ]
        },
        {
          label: 'Staff Management',
          route: 'staff-staff',
          icon: 'fa fa-users',
          children:[]
        },
        {
          label: 'Courses',
          route: 'sub',
          icon: 'fa fa-book-open',
          children:[
            {label:'My Courses', route:'/staff/my-courses'},
            {label:'Course Allocation', route:'/staff/courses/allocation'},
          ]
        },
        {
          label: 'Results',
          route: 'sub',
          icon: 'fa fa-book',
          children:[
            {label:'Result Management', route:'/staff/results'},
            {label:'Result Input', route:'/staff/results/input'},
            {label:'Result Computation', route:'/staff/results/computation'},
            {label:'Advanced Compilation', route:'/staff/results/advanced-compilation'},
            {label:'GPA Tracking', route:'/staff/results/gpa-tracking'},
            {label:'Transcript Generation', route:'/staff/results/transcript'},
          ]
        },
        {
          label: 'Score Input',
          route: 'sub',
          icon: 'fa fa-edit',
          children:[
            {label:'Individual Score Input', route:'/staff/scores'},
            {label:'Batch Score Input', route:'/staff/scores/batch'},
            {label:'Score Verification', route:'/staff/scores/verification'},
          ]
        },
        {
          label: 'Academic Setup',
          route: 'sub',
          icon: 'fa fa-cog',
          children:[
            {label:"Faculty", route:"/staff/faculty"},
            {label:"Department", route:"/staff/department"},
            {label:"Programmes", route:"/staff/programme"},
            {label:"Courses", route:"/staff/courses"},
            {label:"Course Categories", route:"/staff/course_category"},
            {label:"Programme Courses", route:"/staff/programme_courses"},
            {label:"Grade Settings", route:"/staff/grade-settings"},
            {label:"Levels", route:"/staff/level"},
            {label:"Sessions", route:"/staff/sessions"},
          ]
        },
        {
          label: 'System Config',
          route: 'sub',
          icon: 'fa fa-wrench',
          children:[
            {label:"Invoice Types", route:"/staff/invoice_types"},
            {label:"Signatories", route:"/staff/signatories"},
            {label:"Control Manager", route:"/staff/controls"},
            {label:"Permissions", route:"/staff/permissions"},
            {label:"Roles", route:"/staff/roles"},
          ]
        },
      ],
      store: useAuthStore(),
      sessions: [],
    }
  },
  props:{
    modelValue:{
      type:Boolean,

    }
  },
  computed:{
    sidebarOpen:{
      get(){
        return this.modelValue
      },
      set(value){
        this.$emit('update:modelValue', value)
      }
    }
  },

  mounted() {
    this.loadSessions;
    this.updateTime();
    this.timeInterval = setInterval(this.updateTime, 1000);

    // Close user menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    isMenuOpen(menuItem) {
      return this.openMenus.includes(menuItem.label);
    },
    toggleMenu(menuItem) {
      const index = this.openMenus.indexOf(menuItem.label);
      if (index === -1) {
        this.openMenus.push(menuItem.label);
      } else {
        this.openMenus.splice(index, 1);
      }
    },
    selectMenu(e, routeName, route) {
      e.preventDefault();
      e.stopPropagation();

      // Prevent multiple rapid clicks
      if (this.isNavigating) return;
      this.isNavigating = true;

      // Safety timeout to reset navigation flag
      setTimeout(() => {
        this.isNavigating = false;
      }, 2000);

      this.store.setRoute(route);

      if (routeName === 'sub' && route.children.length) {
        this.toggleMenu(route);
        this.isNavigating = false;
      } else {
        try {
          this.$router.push({ name: routeName }).then(() => {
            this.isNavigating = false;
          }).catch(err => {
            console.error('Navigation error:', err);
            this.isNavigating = false;
          });
        } catch(e) {
          console.error('Router error:', e);
          this.isNavigating = false;
        }
      }
    },
    navigateTo(sub) {
      // Prevent multiple rapid clicks
      if (this.isNavigating) return;
      this.isNavigating = true;

      // Safety timeout to reset navigation flag
      setTimeout(() => {
        this.isNavigating = false;
      }, 2000);

      const route = this.store.getRoute;
      route.icon = route.icon + ' mr-1';
      route.child = sub;
      this.store.setRoute(route);
      this.$globals.route = this.store.getRoute;

      this.$router.push(sub.route).then(() => {
        this.isNavigating = false;
      }).catch(err => {
        console.error('Submenu navigation error:', err);
        this.isNavigating = false;
      });
    },

    // New methods for improved UI
    getUserInitials() {
      const user = this.store.user;
      if (user && user.first_name && user.last_name) {
        return (user.first_name[0] + user.last_name[0]).toUpperCase();
      }
      return 'ST';
    },

    getUserName() {
      const user = this.store.user;
      if (user && user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
      }
      return 'Staff User';
    },

    getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    updateTime() {
      this.currentTime = this.getCurrentTime();
    },

    handleClickOutside(event) {
      if (!event.target.closest('.user-menu-container')) {
        this.showUserMenu = false;
      }
    },

    isActiveRoute(route) {
      return this.$route.name === route;
    },

    isActiveSubRoute(route) {
      return this.$route.path === route;
    },

    viewProfile() {
      this.showUserMenu = false;
      this.$router.push('/staff/profile');
    },

    changePassword() {
      this.showUserMenu = false;
      this.$router.push('/staff/change-password');
    },

    async logout() {
      try {
        this.showUserMenu = false;

        // // Show confirmation dialog
        // const confirmed = await this.$globals.showConfirm(
        //   'Logout Confirmation',
        //   'Are you sure you want to logout?',
        //   'warning'
        // );


          // Clear auth data
          this.store.logout();

          // Clear local storage
          localStorage.clear();

          // Show success message
          this.$globals.showMessage('Logged out successfully', 'success');

          // Redirect to login page
          this.$router.push('/staff/login');

      } catch (error) {
        console.error('Logout error:', error);
        this.$globals.showMessage('Logout failed. Please try again.', 'error');
      }
    }
  },
  async created() {
    this.$globals.route = this.store.getRoute;
    await this.waitForSchoolInfo();
    this.sessions = this.schoolSessions;
    
    // Open the current menu if on a sub-route
    const currentRoute = this.$route.path;
    for (const menuItem of this.menuItems) {
      if (menuItem.children.some(child => child.route === currentRoute)) {
        this.openMenus.push(menuItem.label);
      }
    }
  }
}
</script>

<style scoped>
/* Scrollbar Styling */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 4px;
}

.scrollbar-track-slate-800::-webkit-scrollbar-track {
  background-color: #1e293b;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hover effects */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Animation classes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Custom shadow effects */
.shadow-glow {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

/* Menu item active state */
.menu-item-active {
  position: relative;
}

.menu-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 2px 2px 0;
}

/* User menu container for click outside detection */
.user-menu-container {
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .h-screen {
    height: 100vh !important;
  }

  .sidebar-container {
    position: fixed;
    z-index: 50;
  }
}

/* Dark mode enhancements */
.dark-gradient {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}
</style>