<template>
    <div :class="{'translate-x-0 ease-out w-64': sidebarOpen, '-translate-x-full ease-in w-0': !sidebarOpen}"
        class="shadow-2xl z-30  text-sky-400 transform relative" style="transition:all .2s">
       <div class="grid grid-cols-3 px-3 py-4 transition-transform" :style="sidebarOpen ? 'transform: translateX(0);':'transform: translateX(-200px);' ">
         <div class="col-span-1"><img src="@/assets/logo.jpg" class="w-10 rounded-md"></div>
         <div class="col-span-2 cursor-pointer"  data-modal-target="top-left-modal" data-modal-toggle="top-left-modal" type="button">            
             <p @click="showSessionModal=true" :class="`hover:bg-[${$globals.colors.active}]/75 hover:ps-3`" class="m-0 transition rounded-md underline text-sky-600">2022/2023</p>
             <p :class="`hover:bg-[${$globals.colors.active}]/75 hover:ps-3`" class="m-0 transition rounded-md underline text-sky-600">First Semester</p>
         </div>
       </div>
     <div class="p-0 m-0 overflow-y-auto h-[86vh]" style="transition: all .3s;">         
       <ul class="m-0 transition-transform" :style="sidebarOpen ? 'transform: translateX(0);':'transform: translateX(-300px);' ">
           <li v-for="(menuItem, i) in menuItems" :key="i">
               <a @click="selectMenu($event, menuItem.route, menuItem)" href="#" class="hover:bg-gray-200/20 grid grid-cols-6 p-4 xmenu font-semibold border-b-[1px] border-gray-200/50" :class="`text-${$globals.colors.primary} hover:bg-[${$globals.colors.active}] ${$router.currentRoute.name == menuItem.route ? 'bg-active' : ''}`"><i :class="`${menuItem.icon} text-2xl`"></i><span class="col-span-4 ml-2">{{ menuItem.label }}</span><i class="ml-4 fa fa-chevron-right place-self-end"></i></a>
               <ul class="hidden xxmenu px-4">
                   <li class="px-2 py-1 cursor-pointer text-gray-600 hover:underline" v-for="(subMenu, index) in menuItem.children" :key="`subMenu-${index}`" @click="navigateTo(subMenu)"><i class="fa fa-caret-right"></i> {{subMenu.label}}</li>
               </ul>
           </li>       
       </ul>
     </div>
     <div class="absolute z-34 top-10 right-[-15px]">
       <button @click="toggleSidebar" class="text-sky-600 rounded-full bg-white px-2 py-1 h-8 w-8 shadow-md">          
         <span class="fa fa-chevron-right text-xs"></span>         
       </button>
     </div>
       <Transition name="fade" mode="out-in">
           <div v-if="showSessionModal">
               <SessionModal :sessions="sessions" @on-close="showSessionModal=false" class="fixed bg-black/50 top-0 left-0 right-0 z-50 w-full p-4 min-h-screen" />
           </div>
       </Transition>
   </div>
</template>

<script>
import SessionModal from '@/components/SessionModal.vue'
import { useAuthStore } from '@/stores/auth';
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';
import jquery from "jquery";
const $ = jquery;

export default {
 name: 'StudentSidebar',
 mixins: [schoolInfoMixin],
 components: {
   SessionModal
 },
 data() {
   return {
     showSessionModal: false,
     sidebarOpen: true,
 menuItems: [
       { 
           label: 'Dashboard', 
           route: 'student-dashboard',
           icon: 'fa fa-tachometer', 
           children:[]
       },
       { 
           label: 'Profile', 
           route: 'student-profile',
           icon: 'fa fa-user', 
           children:[]
       },
       { 
           label: 'Course Registration', 
           route: 'student-courses',
           icon: 'fa fa-book', 
           children:[]
       },
       { 
           label: 'Results', 
           route: 'student-results',
           icon: 'fa fa-graduation-cap', 
           children:[]
       },
       { 
           label: 'Payments', 
           route: 'student-payments',
           icon: 'fa fa-credit-card', 
           children:[]
       },
       { 
           label: 'Invoices', 
           route: 'student-invoices',
           icon: 'fa fa-file-text', 
           children:[]
       },
       { 
           label: 'Wallet', 
           route: 'student-wallet',
           icon: 'fa fa-wallet', 
           children:[]
       },
       { 
           label: 'Documents', 
           route: 'student-documents',
           icon: 'fa fa-folder', 
           children:[]
       }
     ], 
   store:useAuthStore(),
     sessions: [], // Make sure to declare all data properties
   }
 },
 methods: {
   toggleSidebar() {
     this.sidebarOpen = !this.sidebarOpen;
   },
   selectMenu(e, routeName, route) {
     e.stopPropagation();
     this.store.setRoute(route);
     const elt = $(e.target).closest('.xmenu');
     $('.xmenu').removeClass('bg-active');
     elt.addClass('bg-active');
     route.icon = route.icon + ' mr-1'
     this.$globals.route = route
     if (routeName === 'sub') {
         elt.next().slideToggle(100);
     } else {
        try{
            this.$router.push({ name: routeName }).catch(err => {});
        }catch(e){
            
        }
     }
   },
   navigateTo(sub) {
     
     const  route = this.store.getRoute
     route.icon = route.icon + ' mr-1'
     route.child = sub;
     this.store.setRoute(route)        
     this.$globals.route = this.store.getRoute;
     this.$router.push(sub.route)
   }
 },
 async created() {
   this.$globals.route = this.store.getRoute;

   // Wait for school info to be loaded if not already available
   await this.waitForSchoolInfo();

   // Use school info data instead of making API calls
   this.sessions = this.schoolSessions;
 }
}
</script>
