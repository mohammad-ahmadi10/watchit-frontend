import Navbar from './Navbar';



/* ReactElement<any, string | React.JSXElementConstructor<any>> */
const Layout = ({children}) =>{
    return  <>
     <Navbar/> 
     {children}
     {/* <Footer/> */}
     </>
}

export default Layout;

