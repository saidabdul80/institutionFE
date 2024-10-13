import './assets/main.css';
import './input.css';
import { createApp, nextTick, reactive } from 'vue';
import { createPinia } from 'pinia';
import 'fontawesome-4.7/css/font-awesome.min.css';
import 'primeicons/primeicons.css'
import axios from 'axios';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
//import { globals } from "./stores/globals";
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import Card from 'primevue/card';

import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';



import endpointRoutes  from './stores/endpointRoutes.js';
import { useGlobalsStore } from './stores/globals';

window.baseUrl = `http://localhost:8000/`;

function initializeApp() {
    const app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(ToastService);
    app.use(PrimeVue,{
      theme: {
          preset: Aura
      }
   });
    app.directive('tooltip', Tooltip);

    // Registering components globally
    app.component('Dropdown', Dropdown);
    app.component('Button', Button);
    app.component('Dialog', Dialog);    
    app.component('Card', Card);    

    // Setting up global properties
    app.config.globalProperties.$endpoints = endpointRoutes;
 
    const global = useGlobalsStore();
    app.config.globalProperties.$globals = global;

    // Mounting the app immediately
    app.mount('#app');

    // Using nextTick to ensure the DOM is updated before fetching data    
    const schoolInfoString = sessionStorage.getItem('school_info');
    if (schoolInfoString) {
        // Parse the string only if it exists to avoid errors
        const schoolInfo = JSON.parse(schoolInfoString);
        app.config.globalProperties.$globals.school_info = schoolInfo;
    }

    axios.get(`${window.baseUrl}${endpointRoutes.schoolInfo}`, {
        headers: { "x-tenant": location.hostname, "Content-Type": "application/json" }
    }).then((res)=>{

        if (res?.data?.data) {
            sessionStorage.setItem('school_info', JSON.stringify(res.data.data));
            // Update global properties with fetched data
            app.config.globalProperties.$globals.school_info = res.data.data;
        }
    })
}
window.EmtyStorageEvent = new CustomEvent('EmtyStorage', { detail: { message: 'Storage is empty!' } });
initializeApp();
