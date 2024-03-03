import axios from "axios";
import { useAuthStore } from "@/stores/auth";

import {showModal} from '@/plugins/modal'
import {token } from "@/services/auth";
const HTTP = axios.create({ 
  headers: {
    "Content-Type": "application/json",    
    "x-tenant": location.hostname
  },
});
function requestLogout(){
  if(!window.modalOpened){
      showModal({    
        text: 'Network Error: Probably session expired. Logout?',  
      }).then((result) => {        

        /* Read more about isConfirmed, isDenied below */
        if (result) {
        window.modalOpened = false;
        const store = useAuthStore();
        store.logout()
      }/*  else if (result.isDenied) {

      } */
    })
  }
}
function sessionExpired(){
  if(!window.modalOpened){
  showModal({
    text: 'Session expired!',
    confirmText: 'Login',
    cancelText: 'Cancel',
  }).then(function(){   
    window.modalOpened = false; 
    const store = useAuthStore();
    store.logout()
  });
}
}

async function  displayOk(text){
  if(!window.modalOpened){
    await showModal({
      text:text,
      confirmText: 'Ok',
      cancelText: 'Cancel',
    })    
    window.modalOpened = false;
  }
}
async function excludeLogin(callback=()=>{}){
  const currentUrl = window.location.href;
  if (currentUrl.includes("login")) {
    await showModal({text:"Invalid credentials"});    
  } else {
    callback()
  }  
  window.modalOpened = false
}
export const get = async (resource,fullPath=false, except= true) => {  
  const authToken  = token();
  //alert(authToken)
  const store = useAuthStore();
  //store.isLoading = true;
  /* if(authToken  == ''  && except){
    // console.error('Error: Bad Request from api client')
    store.isLoading = false;
    return false
  } */
  try {
    const response = await HTTP.get(fullPath?resource :window.baseUrl+resource,
      { headers: {        
        Authorization: authToken  ? `Bearer ${authToken }` : "",
      }});
    //store.isLoading = false;
    return response.data.data;    
  } catch (e) {
    store.isLoading = false;       
    if (e?.message === "Network Error") {                              
        requestLogout()
    }else if(e.response.status === 401 || e.response.status === 302){
        excludeLogin(sessionExpired)     
      window.modalOpened = true
    }else {
      const message =
      e.response?.data?.status !== 400
        ? ["Something went wrong"]
        : [
            typeof e.response?.data === "object" ? "" : e.response?.data,
            e.response?.data?.message,
            Array.isArray(e.response?.data?.responseBody)
              ? e.response?.data?.responseBody.join(",\n")
              : e.response?.data?.responseBody,
          ];  
       displayOk(message.join('@').replaceAll('@',' '))
    }
    return false;
  }
};

export const post = async (resource, data, fullPath=false, loader= false) => {
  
  const authToken  = token();
  const store = useAuthStore();
  if(loader){
    store.isLoading = true;
  }
  //alert(store.isLoading)
/*   if(authToken  == ''  && except){
    console.error('Error: Bad Request from api client')
    return false
  } */
  try {    
    const response = await HTTP.post(fullPath?resource:window.baseUrl+resource, data,
      { headers: {        
        Authorization: authToken  ? `Bearer ${authToken }` : "",
      }});      
    store.isLoading = false;   
      return response.data
  } catch (e) {    
  //console.log(e.response?.data,43848)
    store.isLoading = false;        
    if (e?.message?.includes("Network Error")) {                            
      displayOk('Network Error')

    }else if(e.status === 401 || e.status === 302){
        await excludeLogin(sessionExpired)     
        window.modalOpened = false
    }else {      
      localStorage.setItem('error', e.response?.data?.data)
      //displayOk(e.response?.data?.data)
    }
    return false;

  }
};
//except is used to ignore authToken  check
export const postFormData = async (resource, data, except= true) => {
  const authToken  = token();
  const store = useAuthStore();
  store.isLoading = true;
  if(authToken  == ''  && except){
    console.error('Error: Bad Request from api client')
    return false
  }
  try {
    
    const response = await HTTP.post(window.baseUrl+resource, data,
      {
        headers: {
          Authorization: authToken  ? `Bearer ${authToken }` : "",
          "Content-Type": "multipart/form-data", 
        },
      });
    store.isLoading = false;        
    return response.data.responseBody; //for now         
  } catch (e) {
    store.isLoading = false;    
    if(e.response?.status === 401 || e.response?.status === 302){
      sessionExpired()
      window.modalOpened = true
    }else 
    if (e?.message === "Network Error") {
      showModal({
        text:"Network Error!",
        confirmText: 'Ok',
        cancelText: 'Cancel',
      });
    } else {      
      const message =
      e.response?.data?.status !== 400
      ? ['Something went wrong']
      : [
        typeof e.response?.data === 'object' ? '' : e.response?.data,
        e.response?.data?.message,
        Array.isArray(e.response?.data?.responseBody) ? e.response?.data?.responseBody.join(',\n') : e.response?.data?.responseBody
        ];            
        
       showModal({
        text:message.join('@').replaceAll('@',' '),
        confirmText: 'Ok',
        cancelText: 'Cancel',
      })
    }

    return false;
  }
  // axios.defaults.baseURL = "http://localhost:3333/api";
};
