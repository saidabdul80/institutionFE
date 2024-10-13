import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { handleError } from '@/helpers/error-handling';
import ls from "@/services/ls";
import { useGlobalsStore } from "./globals";

export const useClient = defineStore("client", () => {

  
  async function http(config = { method: 'get', path: '', data: {}, fullPath: false }) {
    const token = ls.get("auth.token");
    let url = window.baseUrl + config?.path.replace('//', '/');

    if (config?.fullPath) {
      url = config?.path;
    }
    if (config.method.toLowerCase() === 'get' && config?.data != undefined) {
      const urlParams = new URLSearchParams(config.data).toString();
      if (config.fullPath) {
        url += '&' + urlParams;
      } else {
        url += '?' + urlParams;
      }
    }

    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "x-tenant": location.hostname
    };

    if (config?.data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
   /*  if (config?.responseType != null) {
      headers.responseType = config.responseType;
    } */
    try {
      const response = await axios({
        method: config?.method,
        url: url,
        data: config?.data,
        headers: headers,
        responseType: config?.responseType
      });
      useGlobalsStore().nameRules = ref({})
      useGlobalsStore().isOnlineStatus =true
      return response.data;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      
      if (errors) {
        useGlobalsStore().updateNameRules(errors);
      }
      if (error?.response?.status === 401) {
        const route = window.currentRoute;
        if (route.meta.requiresAuth) {
          let userRootPath = '';
          /* console.log(useRoute()) */
          userRootPath = window.currentRoute.matched[0]?.path?.replace('/', '') || '';
          useGlobalsStore().logout(userRootPath)
          /* if(userRootPath != ''){
          }else{
            router.push({ path: `/` }); // Redirect to login or home page
          } */
        }
      }
      if(!error?.response){
        useGlobalsStore().isOnlineStatus =false
      }else{
        useGlobalsStore().isOnlineStatus =true
      }
      handleError(error);
      return false
    }
  }

  return { http };
});
