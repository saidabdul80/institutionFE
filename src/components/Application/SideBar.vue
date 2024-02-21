<template>


    <div>
        <div class="mb-4  place-content-center flex items-center justify-center px-3 py-4 transform transition">
                <div class="mr-2"><img src="@/assets/logo.jpg" class="w-10 rounded-md"></div>
                <div class="text-white col-span-4">
                  <p class="m-0 text-xs font-bold">NI’IMA College</p>
                  <p class="m-0 text-xs">Of Science & Technology</p>
                </div>
              </div>
              <div class="flex justify-center items-center flex-col">
                <div :class="`bg-[${$globals.colors.ap_secondary}]`" class="rounded-full flex justify-center items-center w-[65px] h-[65px] py-5">
                    <span class=" font-bold text-5xl mb-2">A</span>
                </div>
                <p class="font-bold text-white">Abdulkareem Abdullahi</p>
              </div>

              <div class="mt-10">
                <ul class="pl-3">
                  <li @click="selectMenu($event)" class="p-4 transitionx xmenu cursor-pointer rounded-l-lg"  :class="`text-[${$globals.colors.ap_secondary}]`">
                    <i class="fa fa-file"></i><span>My Application</span>
                  </li>
                  <li @click="selectMenu($event)" class="p-4 transitionx xmenu cursor-pointer rounded-l-lg" :class="`text-[${$globals.colors.ap_secondary}]`" >
                    <i class="fa fa-file"></i><span>Payments</span>
                  </li>
                  <li @click="selectMenu($event)" class="p-4 transitionx xmenu cursor-pointer rounded-l-lg" :class="`text-[${$globals.colors.ap_secondary}]`">
                    <i class="fa fa-file"></i><span>Faqs</span>
                  </li>
                </ul>
              </div>
    </div>
</template>

<script>
import jquery from "jquery";
const $ = jquery;
export default {
        data() {
    return {
        bgColor:'',
        ap_secondary:''
    }
  },
  created(){
    this.bgColor = this.$globals.colors.ap_primary;
    this.ap_secondary = this.$globals.colors.ap_secondary;

   
  },methods: {
    selectMenu(e){
      
      e.stopPropagation(); // Use stopPropagation() instead of preventPropagation()
        const elt = $(e.target).closest('.xmenu');
        $('.xmenu').removeClass('apMenuActive'); // Use 'x-menu' instead of 'xmenu'
        elt.addClass('apMenuActive');     
    }
  }
    }
</script>


<style scoped>
.transitionx{
  transition: all .3s;
  position:relative;
  
}
.transitionx::before{
  content:'';
  position:absolute;
  top:-15px;
  right:0px;
  width:15px;
  height:15px;
  background:transparent;
  border-bottom-right-radius: 20px;
  box-shadow: 2px  5px 0px 1px transparent;
  z-index:1;
  transform-origin: bottom right;

}
.apMenuActive{
  position:relative;
  transition: all .3s;  
}
.apMenuActive::before{
  content:'';
  position:absolute;
  top:-15px;
  right:0px;
  width:15px;
  height:15px;
  background:v-bind(bgColor);
  border-bottom-right-radius: 20px;
  box-shadow: 2px  5px 0px 1px v-bind(ap_secondary);
  z-index:1;
  transform-origin: bottom right;

}

.apMenuActive::after{
  content:'';
  position:absolute;
  bottom:-15px;
  right:0px;
  width:15px;
  height:15px;
  background:v-bind(bgColor);
  border-top-right-radius: 20px;
  box-shadow: 2px  -5px 0px 1px v-bind(ap_secondary);
  z-index:1;
  transform-origin: bottom right;

}
.transitionx.apMenuActive i{
  border-radius:9px;
  
  padding:10px;
  background:v-bind(bgColor);
  color:v-bind(ap_secondary) !important;
}
.apMenuActive{
  /* right:22px; */
  /* transform: scale(1); */
}
</style>