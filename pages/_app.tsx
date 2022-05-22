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


// this should give a better typing
type Props = AppProps & {
  Component: Page
}

function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout ?? (page => page)
  const Layout = Component.layout ?? (({children}) => 
  <>

    <Navbar/>
    {children}
    <Footer/>
  </>
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
   </ThemeProvider> 
  ) 

}

export default MyApp
