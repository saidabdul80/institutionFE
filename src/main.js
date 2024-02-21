import './assets/main.css'
import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import 'fontawesome-4.7/css/font-awesome.min.css';

//in main.js
import 'primevue/resources/themes/aura-light-green/theme.css'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import { globals } from "./stores/globals";
import { endpointRoutes } from './stores/endpointRoutes.js';
const app = createApp(App)
app.config.globalProperties.$endpoints = endpointRoutes;
const deepGlobals = reactive(globals);
//deepGlobals.notification = reactive(deepGlobals.notification);
app.config.globalProperties.$globals = deepGlobals;
import Dropdown from 'primevue/dropdown';
app.use(createPinia())
app.use(router)
app.use(PrimeVue);
app.component('dropdown',Dropdown);
app.mount('#app')
window.baseUrl = `http://localhost:8000/`;
