import axios from "axios";
import { useAuthStore } from "@/stores/auth";

import {showModal} from '@/plugins/modal'
import {token } from "@/services/auth";
import { useGlobalsStore } from "@/stores/globals";
const HTTP = axios.create({
  headers: {
    "Content-Type": "application/json"
  },
});

// Request interceptor to add auth token
HTTP.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authToken');
    if (token) {
      // Remove quotes if present (localStorage sometimes adds them)
      try {
        // Try to parse as JSON first (in case it's stored as JSON)
        token = JSON.parse(token);
      } catch (e) {
        // If parsing fails, use as is
      }
      const cleanToken = String(token).replace(/"/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
HTTP.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle 401 errors for authenticated routes, not login attempts
    if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
      console.log('401 error on authenticated route, logging out');
      // Token expired or invalid
      const store = useAuthStore();
      store.logout();
      // Redirect to appropriate login page
      const currentPath = window.location.pathname;
      const userType = currentPath.split('/')[1];

      if (userType === 'staff') {
        window.location.href = '/staff/login';
      } else if (userType === 'student') {
        window.location.href = '/student/login';
      } else {
        window.location.href = '/application/login';
      }
    }
    return Promise.reject(error);
  }
);


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
    localStorage.clear();
    window.dispatchEvent(window.EmtyStorageEvent);
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
  const globals = useGlobalsStore();
  const session_id = globals.getConfiguration('current_session');
    let url = fullPath ? resource : window.baseUrl + resource;
    if (session_id && !url.includes('session_id')) {
      url += (url.includes('?') ? '&' : '?') + `session_id=${session_id}`;
    }

  //store.isLoading = true;
  /* if(authToken  == ''  && except){
    // console.error('Error: Bad Request from api client')
    store.isLoading = false;
    return false
  } */
  try {
    const response = await HTTP.get(url,
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

export const post = async (resource, data, fullPath=false, loader= false, type={}) => {
  
  const authToken  = token();
  const store = useAuthStore();
  if(loader){
    store.isLoading = true;
  }


  try {    
     const globals = useGlobalsStore();
      const session_id = globals.getConfigurationValue('current_session');
      console.log(globals,session_id)
     if (session_id && !data?.session_id) {
        data.session_id = session_id;
    }
    const response = await HTTP.post(fullPath?resource:window.baseUrl+resource, data,
      { headers: {        
        Authorization: authToken  ? `Bearer ${authToken }` : "",
        ...type
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

export const put = async (resource, data, fullPath=false, loader= false) => {
  const authToken = token();
  const store = useAuthStore();
  if(loader){
    store.isLoading = true;
  }

  try {
    const response = await HTTP.put(fullPath ? resource : window.baseUrl + resource, data, {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });
    store.isLoading = false;
    return response.data.responseBody;
  } catch (e) {
    store.isLoading = false;
    if(e.response?.status === 401 || e.response?.status === 302){
      sessionExpired()
      window.modalOpened = true
    } else if (e?.message === "Network Error") {
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
};

export const del = async (resource, fullPath=false, loader= false) => {
  const authToken = token();
  const store = useAuthStore();
  if(loader){
    store.isLoading = true;
  }

  try {
    const response = await HTTP.delete(fullPath ? resource : window.baseUrl + resource, {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });
    store.isLoading = false;
    return response.data.responseBody;
  } catch (e) {
    store.isLoading = false;
    if(e.response?.status === 401 || e.response?.status === 302){
      sessionExpired()
      window.modalOpened = true
    } else if (e?.message === "Network Error") {
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


//except is used to ignore authToken  check
export const postDownload = async (resource, data, except= true) => {
  const authToken  = token();
  try {
    
    const response = await HTTP.post(window.baseUrl+resource, data,
      {
        headers: {
          Authorization: authToken  ? `Bearer ${authToken }` : "",          
        },
      });   
    return response.data;
  } catch (e) {
   
    return false;
  }
  // axios.defaults.baseURL = "http://localhost:3333/api";
};
