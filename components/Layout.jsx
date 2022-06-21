import Navbar from './Navbar';



/* used for every single of page
   currently every Page has the Navbar section
*/
const Layout = ({children}) =>{
    return  <>
     <Navbar/> 
     {children}
     </>
}

export default Layout;

