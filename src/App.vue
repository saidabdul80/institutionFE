<script>
import { useAuthStore } from "@/stores/auth";
import { get } from '@/api/client'
export default {
  data(){
    return {
      store:useAuthStore()
    }
  },
  async created(){      
    const styleElement = document.createElement('style');        
    const cssRules = `
    .apMenuActive {
      color:${this.$globals.colors.ap_primary} !important;
      background:${this.$globals.colors.ap_secondary} !important; 
      margin-left:20px;
    }
    .bg-active {
        background-color: ${this.$globals.colors.active} !important;
      }`;
      styleElement.textContent = cssRules;
      document.head.appendChild(styleElement);
  }
}
</script>

<template>

  <Transition name="fade">
    <div v-if="store.isLoading" class="flex fixed z-[50000] justify-center items-center bg-[white]/95 w-full h-[100vh]">
      <div class="loader"></div> 
    </div>
  </Transition>
  <router-view></router-view>

</template>

<style scoped>
</style>
