import { Input } from 'antd';

const { Search } = Input;
import "antd/dist/antd.dark.css"




function Navbar() {
  return (
    <div>
      
      <div>
         <Search placeholder="input search loading with enterButton" loading enterButton />
         
         </div>
    </div>
  )
}

export default Navbar