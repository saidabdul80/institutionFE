<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
     <div class="relative">
        <Sidebar v-model="toggleSidebar" />
        <div class="absolute top-20 right-[-16px] z-[300]">
      <button
        @click="toggleSidebar = !toggleSidebar"
        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110"
      >
        <i
          class="fas text-xs transition-transform duration-200"
          :class="{
            'fa-chevron-right': !toggleSidebar,
            'fa-chevron-left': toggleSidebar
          }"
        ></i>
      </button>
    </div>
      </div>
    <!-- Main content area -->
    <div :style="{width: toggleSidebar ? 'calc(100% - 288px)' : '100%'}"  class=" h-[100vh] relative">

      <!-- Hamburger toggle button -->

      <Transition name="fade">
        <div v-if="$globals.message.text !== ''" :class="[
          'text-white absolute top-0', 'text-center', 'w-full', 'h-[3vh]', 'px-3', 'mb-0',
          $globals.message.type === 'success' ? 'bg-green-500' :
            $globals.message.type === 'error' ? 'bg-red-500' :
              'bg-orange-500/75'
        ]">
          {{ $globals.message.text }}
        </div>
      </Transition>

      <div class="px-8 bg-gray-100/25 h-[97vh] mt-0">
        <Breadcrumb class="py-6" :home="$globals.route" :model="[$globals.route?.child || {}]"
          :pt="{ root: { class: 'bg-transparent' } }" separator="/" />
          <div class="!h-[93vh] overflow-auto">
            <router-view></router-view>
          </div>
        <!-- Add your main content here -->
      </div>
    </div>
  </div>
</template> 

<script>
import SideBar from '@/components/Staff/SideBar.vue'

import Breadcrumb from 'primevue/breadcrumb';
import { useAuthStore } from '@/stores/auth';
export default {
  name: 'SidebarDrawer',
  components: {
    Sidebar: SideBar,
    Breadcrumb
  },
  data() {
    return {
      toggleSidebar:true,
      current: { icon: 'fa fa-address-book', label: 'Applicant' },
      items: [{ label: 'Dashboard' }],
      store: useAuthStore()
    }
  },
  methods: {

  },
  created() {
    this.current = this.$globals.route
    this.current.icon = this.current.icon + ' mr-1'
    this.items = [this.$globals.route?.child]
  }
}
</script>

<style scoped>
/* Add scoped styles if necessary */
</style>
