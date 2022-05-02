import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import {Provider} from "react-redux";
import { store } from './../src/store';
import Router from "next/router";
import { SpinnerDotted } from 'spinners-react';
import { useState } from 'react';


function MyApp({ Component, pageProps }: AppProps) {

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
    <Provider store={store}>
      
        {
          load ? 
          <>
          
          <div className='center'> <SpinnerDotted/>  </div>  
          </> 
          :
          <>
          <Component {...pageProps} />
          </>
        }
        
    </Provider>
  ) 

}

export default MyApp
