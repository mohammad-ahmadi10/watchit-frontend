import '../styles/globals.scss'
import {Provider} from "react-redux";
import { store , wrapper } from './../src/store';
import Router from "next/router";
import { SpinnerDotted } from 'spinners-react';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes'
import Layout from '../components/Layout'
import { IconContext } from "react-icons";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import costumAxios from "../utils/axios";
import axios from "axios";
import { login  , User } from '../src/features/userSlice';
import {useRouter} from 'next/router'
import {forceReload} from "../utils/functions";
import Logo from "../public/Logo.svg";





function MyApp({ Component, pageProps }) {  

  const getLayout = Component.getLayout ?? ((page) => page)
  
  const [load , setLoading] = useState(false);
 

  Router.events.on('routeChangeStart', (url) =>{
    setLoading(true);
    
  })

  Router.events.on('routeChangeComplete', (url) =>{
    setLoading(false);
  })
  Router.events.on('routeChangeError', (url) =>{
    setLoading(false);
  })



    const router = useRouter();
    

    useLayoutEffect(() =>{
      ( async () =>{
        try{
          const token = localStorage.getItem("ACTKEN");
          if(token === null){
            const refToken = localStorage.getItem("SSRFSH");
            if(refToken === null) return;
            const res = await axios.get(`${process.env.NEXT_PUBLIC_REMOTE}/auth/refresh`, 
             {
              headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${refToken}`},
             });
             
             localStorage.setItem("ACTKEN", res.data.accessToken)
/*              setTimeout(() =>{
               forceReload(router);
             },250) */
          }else{
          const res = await costumAxios.get("/auth/me", { headers:{'Authorization':`Bearer ${token}`}} )
          if(res){
          const {id, email, username, avatar} = res.data.modifiedUser;
          const newUser = {
            id,
            username,
            email,
            profileImage:avatar,
          }
          const s = store.dispatch(login({
            user: newUser,
            logIn:true,
            errorMSG:""
          }))
          localStorage.setItem("user", JSON.stringify(s))
         }
        }
        }catch(e){
            console.log(e)
        }
    })();
  },[]) 
 



  return (
   <ThemeProvider>
<IconContext.Provider value={{ color: "white" , size:"35", className: "global_icon_container" }}>
    
        {
          load ? 
          <>
          <div className='center'> <SpinnerDotted/>  </div>  
          
          </> 
          :
          <>
          <Layout>
            {getLayout(<Component {...pageProps} />)}
          </Layout>
          </>
        }

    </IconContext.Provider>
   </ThemeProvider> 
  ) 

}

export default wrapper.withRedux(MyApp)
