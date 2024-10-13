<script>
import { useAuthStore } from "@/stores/auth";
import { get } from '@/api/client'
import NotificationRoot from "./components/notifications/NotificationRoot.vue";
import Alert from "./components/Alert.vue";
import { useGlobalsStore } from "./stores/globals";
export default {
  data(){
    return {
      store:useAuthStore(),
      globals:useGlobalsStore()
    }
  },
  components: {
    NotificationRoot,
    Alert
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
  }, 
  methods:{
    easylogout(){
      this.$router.push(this.store.loginPath())
    }
  },
  mounted(){
    //window.addEventListener('EmtyStorage',this.easylogout())
  }
}
</script>

<template>

  <Transition name="fade">
    <div v-if="this.store.isLoading" class="flex fixed z-[50000] justify-center items-center bg-[white]/95 w-full h-[100vh]">
      <div class="loader"></div> 
    </div>
  </Transition>
  <router-view></router-view>

  <NotificationRoot />
  <Alert
    :text="globals.alert?.text"
    :icon="globals.alert?.icon"
    :title="globals.alert?.title"
    :confirmBtnText="globals.alert?.confirmBtnText"
    :cancelBtnText="globals.alert?.cancelBtnText"
    v-model="globals.alert.show"
    :loading="globals.alert.loading"
    :img-path="globals.alert.imgpath"
  />
</template>

<style scoped>
</style>
