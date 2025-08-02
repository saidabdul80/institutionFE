<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Background Elements -->
    <!-- <div class="hidden lg:block application-bg fixed top-0 w-full h-full opacity-10"
         style="background-image:url('/src/assets/bg2.jpg');background-repeat:no-repeat; background-position:right top; background-size:contain">
    </div> -->

    <!-- Main Layout Container -->
    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- Desktop Sidebar -->
      <div class="hidden lg:block lg:w-80 xl:w-96 bg-white shadow-2xl border-r border-gray-200"
           :style="`background:${bgColor}`">
        <div class="sticky top-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="lg:hidden bg-white shadow-md border-b border-gray-200 sticky top-0 z-50"
           :style="`background:${bgColor}`">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center">
            <img src="@/assets/logo.jpg" class="w-8 h-8 rounded-full mr-3">
            <h1 class="text-white text-lg font-bold">{{ $globals.school_info?.name || 'Institution Portal' }}</h1>
          </div>
          <button @click="toggleMobileMenu" class="text-white p-2 rounded-md hover:bg-white/10">
            <i :class="showMobileMenu ? 'fa fa-times' : 'fa fa-bars'" class="text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 z-50 flex">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="toggleMobileMenu"></div>
        <div class="relative w-80 max-w-xs bg-white shadow-xl" :style="`background:${bgColor}`">
          <div class="h-full overflow-y-auto">
            <Sidebar @navigate="closeMobileMenu" />
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 lg:flex-grow">
        <div class="h-full lg:h-screen overflow-y-auto relative" :style="`background:${$globals.colors.ap_secondary}`">
          <!-- Content Container -->
           {{ $globals.message.text }}
             <Transition name="fade">
              <div v-if="$globals.message.text != ''" :class="[
                toggleMobileMenu?'w-[86%]':'w-auto',
                'text-white fixed z-50 top-0', 'text-center', 'h-[3vh]', 'px-3', 'mb-0',
                $globals.message.type === 'success' ? 'bg-green-500' :
                  $globals.message.type === 'error' ? 'bg-red-500' :
                    'bg-orange-500/75'
              ]">
                {{ $globals.message.text }}
              </div>
            </Transition>
          <div class="min-h-full">
            <!-- Payment Status Banner -->
            <PaymentStatusBanner />
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/Application/SideBar.vue'
import Announcement from '@/components/Application/Announcement.vue'
import PaymentStatusBanner from '@/components/Application/PaymentStatusBanner.vue'
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth';
import { get } from '@/api/client';

export default {
  name: 'ApplicantIndex',
  components: {
    Sidebar: SideBar,
    Button,
    Announcement,
    PaymentStatusBanner
  },
  data() {
    return {
      bgColor: '',
      ap_secondary: '',
      showMobileMenu: false,
      authStore: useAuthStore(),
      isLoadingUser: false
    }
  },
  created() {
    this.bgColor = this.$globals.colors.ap_primary;
    this.ap_secondary = this.$globals.colors.ap_secondary;
  },
  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    closeMobileMenu() {
      this.showMobileMenu = false;
    },
    async fetchUserData() {
      if (this.isLoadingUser || !this.authStore.isAuthenticated) return;

      this.isLoadingUser = true;
      try {
        // Fetch fresh user data from backend
        const response = await get(this.$endpoints.applicant.applicantSelf.url);
        if (response && response.data) {
          // Update auth store with fresh user data
          this.authStore.$state.userInfo = response.data.applicant;
          console.log('User data refreshed:', response.data.applicant);
        }
      } catch (error) {
        // console.error('Error fetching user data:', error);
        // // If token is invalid, logout user
        // if (error.response?.status === 401) {
        //   await this.authStore.logout(this.authStore.getLogoutRoute());
        //   this.$router.push({ name: 'applicant-login' });
        // }
      } finally {
        this.isLoadingUser = false;
      }
    }
  },
  async mounted() {
    // Fetch user data when component mounts
    await this.fetchUserData();
  },
  watch: {
    // Watch for route changes and refresh user data
    '$route'() {
      this.fetchUserData();
    }
  }
}
</script>

<style scoped>
/* Add scoped styles if necessary */
.application-bg {
  width: 100%;
  height: 100vh;
  position: fixed
}

.application-bg::before {
  content: '';
  display: block;
  position: absolute;
  background: v-bind(bgColor);
  /* Corrected syntax for Vue.js binding */
  top: 0;
  left: 0px;
  z-index: 1;
  width: 23%;
  height: 100%;
  /* Added height property */
}

.application-bg::after {
  content: '';
  display: block;
  position: absolute;
  background-image: url('/src/assets/stars.png');
  /* Corrected syntax for Vue.js binding */
  background-size: 200%;
  top: 0;
  filter: invert(1) contrast(500%);
  -webkit-filter: invert(1) contrast(500%);

  left: 0px;
  z-index: 2;
  width: 25%;
  height: 100%;
  /* Added height property */
}

.nav-btn {
  width: 40px;
  height: 2px;
  position: relative;
  
}

.nav-btn::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translateY(8px);
  background: black;
  box-shadow: 0px -8px 0px black;
  pointer-events:auto !important;
}

.nav-btn::after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translateY(-8px);
  background: black;
  pointer-events:auto !important;
}

.navigation {
  left: -250px;
  transition: all .3s;
}
.navigation.showSidebar .nav-btn::before {
  transform: translateY(0)  rotate(45deg);
  background:white;
  left: -75px;
  box-shadow: none !important;
  width:15px;

}
.navigation.showSidebar .nav-btn::after {
  left: -75px;
  background:white;
  width:15px;
  transform: translateY(0) rotate(-45deg)
}
.showSidebar {
  left: 0px !important;
}</style>
