<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main content area -->
    <div class="w-full h-[100vh] relative">

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
        <router-view></router-view>
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
