import axios from "axios";
import { login , register} from "..//src/features/userSlice";
import {  store  } from '../src/store';

/* "http://192.168.188.52:8200"  "https://api.theone-web.com" */
const BASE_URL = "https://api.theone-web.com";
const instance = axios.create({
  baseURL: BASE_URL
});


if (typeof window !== 'undefined') {
  
  const token = localStorage.getItem("ACTKEN");
  instance.interceptors.request.use(
    (config)=> {
      config.headers = {'Content-Type':'application/json', 'Authorization':`Bearer ${token}`} 
      return config
    }
    )
    instance.interceptors.response.use(
      (response) =>  response,
      async err =>{
        const originalRequest = err.config;
        
        const status = err.response ? err.response.status : null; 
        console.log(status)
        if(axios.isAxiosError(err) ){  
          
          if(!err?.response){
            store.dispatch(login({
              user: null,
              logIn:false,
              errorMSG:"No Server Response"
        }))
      }
      else if(status === 400){
        
        store.dispatch(register({
          user: null,
          logIn:false,
          errorMSG:err?.response?.data
        }))
      }       
      else if(err.response?.status === 409){
        const ms  = store.dispatch(register({
          user: null,
          logIn:false,
          errorMSG:err?.response?.data
        }))
        /* localStorage.setItem("user", JSON.stringify(ms)); */

        
      }
      else if(status === 403){
        const ms = store.dispatch(login({
          user: null,
          logIn:false,
          errorMSG:err?.response?.data
        }))
        /* localStorage.setItem("user", JSON.stringify(ms)); */
      }
      else{
        store.dispatch(login({
          user: null,
          logIn:false,
          errorMSG:"Login Failed"
        }))
      }
    }
    if(status === 401){
      
      try {
        const token = localStorage.getItem("SSRFSH");
        const res = await axios.get(`${BASE_URL}/auth/refresh`, 
        {
          headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${token}`},
          
        });
        localStorage.setItem("ACTKEN", res.data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        originalRequest._retry = true;
        return axios.request(originalRequest)
        
      } catch (error) {
        if(axios.isAxiosError(error)){
          const ms = store.dispatch(login({
            user: null,
            logIn:false,
            errorMSG:"Invalid refreshtoken"
          }))
          /* localStorage.setItem("user", JSON.stringify(ms)); */
          return error.response?.data;
        }
      }
    }
    
    return err;
    
  }
  );
}
  
  export default instance;