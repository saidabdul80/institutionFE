<template>
     <div :class="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in w-[0px] '"
         class=" z-30  w-64 text-sky-400 transform relative" style="transition:all .2s">
      <!-- Sidebar content goes here -->
        <div class="grid grid-cols-3 px-3 py-4 transform transition" :style="sidebarOpen ? 'transform: translateX(0px);':'transform: translateX(-200px);' ">
          <div class="col-span-1"><img src="@/assets/logo.jpg" class="w-10 rounded-md"></div>
          <div class="col-span-2 cursor-pointer"  data-modal-target="top-left-modal" data-modal-toggle="top-left-modal" type="button">            
              <p @click="showSessionModal=true" :class="`hover:bg-[${$globals.colors.active}]/75 hover:ps-3`" class="m-0 transition rounded-md underline text-sky-600">2022/2023</p>
              <p :class="`hover:bg-[${$globals.colors.active}]/75 hover:ps-3`" class="m-0 transition rounded-md underline text-sky-600">First Semester</p>
          </div>
        </div>     

      <div class="p-0 m-0" >        
        <ul class="m-0" style="transition:all .5s" :style="sidebarOpen ? 'transform: translateX(0px);':'transform: translateX(-300px);' ">
            <li v-for="(menuItem, i) in menuItems">
                <a @click="selectMenu($event,menuItem.route)" href="#" class="grid grid-cols-6 p-4 xmenu font-semibold border-b-[1px] border-[gray]/50" :class="` text-${$globals.colors.primary} hover:bg-[${$globals.colors.active}] ${($router.name == menuItem.route) ? 'bg-active':''}`"><i :class="`fa ${menuItem.icon} text-2xl` "></i><span class="col-span-4 ml-2"> {{ menuItem.label }} </span><i class="ml-4 fa fa-chevron-right place-self-end"></i></a>
                <ul  class="hidden xxmenu px-4">
                    <li class="px-2 py-1ca" v-for="subMenu in menuItem.children"><i class="fa fa-caret-right"></i> {{subMenu.label}}</li>
                </ul>
            </li>       
        </ul>
      </div>
      <div class=" absolute z-34 top-10 right-[-15px]">
        <button @click="toggleSidebar" class="text-sky-600 rounded-full bg-white px-2 py-1 h-8 w-8 shadow-md">          
          <span class=" fa fa-chevron-right text-xs"></span>         
        </button>
      </div>
        <Transition name="fade" mode="out-in">
            <div  v-if="showSessionModal">
                <SessionModal :sessions="sessions" @on-close="showSessionModal =false" class="fixed bg-[black]/50 top-0 left-0 right-0 z-50  w-full p-4   min-h-[100vh]" />
            </div>
        </Transition>
    </div>
</template>
<script>
import { get } from '@/api/client';
import SessionModal from '@/components/SessionModal.vue'
import jquery from "jquery";
const $ = jquery;
export default {
  name: 'SidebarDrawer',
  components:{
    SessionModal
  },
  data() {
    return {
        showSessionModal: false,
        sidebarOpen: true,
        menuItems: [
        { 
            label: 'Dashboard', 
            route: 'staff-dashboard',
            icon: 'fa-tachometer', 
            children:[]
        },
        { 
            label: 'Applicant', 
            route: 'sub',
            icon: 'fa-address-book', 
            children:[
                {label:'Dashboard', route:''},
                {label:'Admisssion', route:''},
                {label:'Admitted/Not Admitted', route:''},
                {label:'Qualified/Not Qualified', route:''},
            ]
        },
        { 
            label: 'Manage Students', 
            route: 'staff-student',
            icon: 'fa-user', 
            children:[]
        },
        { 
            label: 'Manage Results', 
            route: 'staff-result',
            icon: 'fa-book', 
            children:[]
        },
        { 
            label: 'Score Input', 
            route: 'staff-score',
            icon: 'fa-edit', 
            children:[]
        },
        { 
            label: 'Preference', 
            route: 'staff-preference',
            icon: 'fa-cog',
            children:[]
        },        
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    selectMenu(e, routeName) {
        e.stopPropagation(); // Use stopPropagation() instead of preventPropagation()
        const elt = $(e.target).closest('.xmenu');
        $('.xmenu').removeClass('bg-active'); // Use 'x-menu' instead of 'xmenu'
        elt.addClass('bg-active');

        if (routeName === 'sub') {
            elt.next().slideToggle(100); // Use slideToggle() instead of toggleSlide()
        } else {
            this.$router.push({ name: routeName });
        }
        },

  },
  async created() {          
    try {
      const res = await get(this.$endpoints.staff.getAllSessions.url);
      this.sessions = res.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }
}
</script>


