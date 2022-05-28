import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import {Provider} from "react-redux";
import { store } from './../src/store';
import Router from "next/router";
import { SpinnerDotted } from 'spinners-react';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes'
import type { Page } from '../types/page'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IconContext } from "react-icons";

import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import costumAxios from "../utils/axios";
import { useDispatch, useSelector } from 'react-redux';
import { login  , User } from '../src/features/userSlice';


// this should give a better typing
type Props = AppProps & {
  Component: Page
}

function MyApp({ Component, pageProps }: Props) {

  
  
  const getLayout = Component.getLayout ?? (page => page)
  const Layout = Component.layout ?? (({children}) => {
    const dispatch = useDispatch();
    
    
    useLayoutEffect(() =>{
      
      ( async () =>{

          const res = await costumAxios.get("/auth/me")
          if(res){
          const {id, email, username, avatar} = res.data.modifiedUser;
          const newUser:User = {
            id,
            username,
            email,
            profileImage:avatar,
          }
    
          dispatch(login({
            user: newUser,
            logIn:true,
            errorMSG:""
          }))
        }
       
       }
      )();
     
      
    },[])

    
    return  <>
     <Navbar/>
     {children}
     <Footer/>
     </>
  }

  
  ) 
  
  
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

  return (
   <ThemeProvider>
<IconContext.Provider value={{ color: "white" , size:35, className: "global_icon_container" }}>
    <Provider store={store}>
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

        
    </Provider>
    </IconContext.Provider>
   </ThemeProvider> 
  ) 

}

export default MyApp
