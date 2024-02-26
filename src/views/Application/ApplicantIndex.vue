<template>
  <div>
    <div class="hidden md:block  application-bg fixed top-0" style="background-image:url('/src/assets/bg2.jpg');background-repeat:no-repeat; background-position:right top; background-size:-31%; background-size:contain">

    </div>
    <div class="grid grid-cols-5 md:w-[90%] place-content-center w-full md:mx-auto h-[100vh] relative z-[3]">
      <div class="hidden md:block col-span-1 h-[80vh] shadow-2xl rounded-l-3xl border-l-4 border-t-4 border-r-0 border-b-4 border-white" :style="`background:${bgColor}`">
        <Sidebar />
      </div>
      <div class=" col-span-5 md:col-span-4 md:h-[80vh] h-[100vh] shadow-lg md:rounded-r-3xl relative w-full"
        :style="`background:${$globals.colors.ap_secondary}` ">
        <div class="block top-0 left-0 md:hidden  z-[50000] fixed w-full">
          <div class="top-0 flex  navigation absolute ">
            <div class=" inline-block  h-[100vh] shadow-md " :style="`background:${bgColor}`">
              <Sidebar />
            </div>
            <div  class="nav hidden:block inline-block relative top-3 left-12 ">
              <div id="menuToggle" class="nav-btn mb-3"></div>
            </div>
          </div>
        </div>
        <div class="md:mt-0 md:px-0 px-4 overflow-auto h-[99vh]">
          <!-- <Button label="Submit" class="p-button-success" /> -->
          <!-- <Announcement /> -->
          <router-view></router-view>
        </div>
        <!-- Add your main content here -->
      </div>
    </div>

  </div>
</template>

<script>
import SideBar from '@/components/Application/SideBar.vue'
import Announcement from '@/components/Application/Announcement.vue'
import jquery from "jquery";
import 'primevue/resources/themes/aura-light-green/theme.css'
import Button from 'primevue/button';


export default {
  name: 'SidebarDrawer',
  components: {
    Sidebar: SideBar,
    Button,
    Announcement
  },
  data() {
    return {
      bgColor: '',
      ap_secondary: ''
    }
  },
  created() {
    this.bgColor = this.$globals.colors.ap_primary;
    this.ap_secondary = this.$globals.colors.ap_secondary;


  },
  methods: {

  },
  mounted() {
    const menuToggler = document.querySelector("#menuToggle");
    const navigation = document.querySelector(".navigation");
    menuToggler.onclick = function (params) {
      navigation.classList.toggle('showSidebar');
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
