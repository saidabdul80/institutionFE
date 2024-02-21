<template>
  <div>
    <div class="application-bg fixed top-0">

    </div>
    <div class="grid grid-cols-5 w-[90%] place-content-center mx-auto h-[100vh] relative z-[3]">      
        <div class="col-span-1 h-[80vh] shadow-2xl rounded-l-3xl border-l-4 border-t-4 border-r-0 border-b-4 border-white" :class="`bg-[${bgColor}]`" >
              <Sidebar />
        </div>
        <div class="col-span-4 h-[80vh] rounded-r-3xl " :class="`bg-[${$globals.colors.ap_secondary}]`" >
          <router-view></router-view>
          <!-- Add your main content here -->
        </div>
    </div>    

  </div>
  
</template>

<script>
import SideBar from '@/components/Application/SideBar.vue'
import jquery from "jquery";
const $ = jquery;
export default {
  name: 'SidebarDrawer', 
  components:{
    Sidebar:SideBar
  },
  data() {
    return {
        bgColor:'',
        ap_secondary:''
    }
  },
  created(){
    this.bgColor = this.$globals.colors.ap_primary;
    this.ap_secondary = this.$globals.colors.ap_secondary;

   
  },
  methods: {
  
  }
}
</script>

<style scoped>
/* Add scoped styles if necessary */
.application-bg{
  width:100%;
  height:100vh;
  position:fixed
}

.application-bg::before {
  content: '';
  display: block;
  position: absolute;
  background:v-bind(bgColor); /* Corrected syntax for Vue.js binding */
  top: 0;
  left: 0px;
  z-index: 1;
  width: 23%;
  height: 100%; /* Added height property */
}
.application-bg::after {
  content: '';
  display: block;
  position: absolute;
  background-image:url('/src/assets/stars.png'); /* Corrected syntax for Vue.js binding */
  background-size: 200%;
  top: 0;
  filter: invert(1) contrast(500%);
  -webkit-filter: invert(1) contrast(500%);  
  
  left: 0px;
  z-index: 2;
  width: 25%;
  height: 100%; /* Added height property */
}

</style>
