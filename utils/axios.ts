import axios from "axios";
import { login , register} from "..//src/features/userSlice";
import { store } from '../src/store';

/* "http://192.168.188.52:8200"  "https://api.theone-web.com" */
const BASE_URL = "http://192.168.188.52:8200";
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials:true
  
});


instance.interceptors.request.use(
  (config)=> {
    config.headers = {'Content-Type':'application/json'} 
    return config
  }
)


instance.interceptors.response.use(
  (response) =>  response,
  async err =>{
    const originalRequest = err.config;

    const status = err.response ? err.response.status : null; 
    
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
        store.dispatch(register({
          user: null,
          logIn:false,
          errorMSG:err?.response?.data
        }))

      }
      else if(status === 403){
        store.dispatch(login({
          user: null,
          logIn:false,
          errorMSG:err?.response?.data
        }))
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
            
            await axios.get(`${BASE_URL}/auth/refresh`, {withCredentials:true});
            originalRequest._retry = true;
            return instance(originalRequest);
              
          } catch (error) {
            if(axios.isAxiosError(error)){
              return error.response?.data;
            }
          }
      }
    

  }
  
);

export default instance;