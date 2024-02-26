    import './assets/main.css'
    import './input.css'
    import { createApp, reactive } from 'vue'
    import { createPinia } from 'pinia'
    import 'fontawesome-4.7/css/font-awesome.min.css';
    import axios from 'axios';
    //in main.js
    import 'primevue/resources/themes/aura-light-green/theme.css'
    import Lara from "./presets/presets/index.js";
    import App from './App.vue'
    import router from './router'
    import PrimeVue from 'primevue/config';
    import { globals } from "./stores/globals";
    import Dropdown from 'primevue/dropdown';
    import Button from 'primevue/button';
    import { get } from './api/client';
    import { endpointRoutes } from './stores/endpointRoutes.js';
    window.baseUrl = `http://localhost:8000/`;
    const app = createApp(App)
    app.config.globalProperties.$endpoints = endpointRoutes;
    const deepGlobals = reactive(globals);
    deepGlobals.route = reactive(deepGlobals.route  );
    deepGlobals.school_info = reactive(deepGlobals.school_info);
    app.config.globalProperties.$globals = deepGlobals;
    const res = await axios.get(window.baseUrl+endpointRoutes.schoolInfo,{headers:{"x-tenant": location.hostname, "Content-Type": "application/json", }});
    
    if(res?.data?.data){
        app.config.globalProperties.$globals.school_info = res.data.data        
    }
    app.use(createPinia())
    app.use(router)
    app.use(PrimeVue,{
        unstyled: true,
        pt:Lara
    });
    app.component('dropdown',Dropdown);
    app.component('Button',Button);
    app.mount('#app')
    
    