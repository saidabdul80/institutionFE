<template>
  <div class="flex h-screen bg-sky-100/25">
    <!-- Sidebar -->
    <Sidebar />  
    <!-- Main content area -->
    <div class="w-full h-[100vh] shadow-2xl" style="background-image:url('/src/assets/background.jpg') !important; background-size:cover">
      
      <!-- Hamburger toggle button -->
      <div class="p-8" style="background-image:url('/src/assets/background.jpg') !important; background-size:cover">
        <router-view></router-view>
        <!-- Add your main content here -->
      </div>
    </div>    
  </div>
</template>

<script>
import SideBar from '@/components/Staff/SideBar.vue'
export default {
  name: 'SidebarDrawer', 
  components:{
    Sidebar:SideBar
  },
  data() {
    return {
      
    }
  },
  methods: {
   
  }
}
</script>

<style scoped>
/* Add scoped styles if necessary */
</style>
