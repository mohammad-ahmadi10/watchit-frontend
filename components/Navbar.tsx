import { Input , Avatar, Popover , Progress, Tooltip} from 'antd';
const { Search } = Input;
import {useState , useCallback} from "react";
import Upload from "./Upload";
import imageCompression from 'browser-image-compression';
import "antd/dist/antd.dark.css"

import styles from "../styles/Navbar.module.scss";

import { motion } from "framer-motion"
import clientAxios from "../utils/axios";

import menu from "react-useanimations/lib/menu"
import UseAnimations from 'react-useanimations';
import infinity from "react-useanimations/lib/infinity"


import { Button } from 'antd';
import {CgMenu , CgClose} from "react-icons/cg";
import {AiOutlineHome} from "react-icons/ai";
import {ImProfile} from "react-icons/im";
import {TiUploadOutline} from "react-icons/ti";
import {VscHistory} from "react-icons/vsc";

import Link from 'next/link'
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import costumAxios from "../utils/axios";
import { selectUser } from '../src/store';
import { useSelector } from 'react-redux';
import { User} from '../src/features/userSlice';
import {useRouter} from 'next/router'

import Image from 'next/image';
import {BsFillPersonFill} from "react-icons/bs";
import {UploadStatus} from "../utils/enums";


const variants = { 
  open: { opacity: 1, x: 0, transition:{stiffness: 100} },
  closed: { opacity: 0, x: "-100%" },
}

const onLogout = async (e:React.MouseEvent<HTMLParagraphElement>) =>{
  const response = await clientAxios.get("auth/logout");
  console.log(response.data)
}



function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [iconSize, setIconSize] = useState(40);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [upStatus,  setUploadStatus] = useState(UploadStatus.ONSTART);
  const [newUser, setNewUser] = useState(false);
  const user = useSelector(selectUser).user

  const router = useRouter();


  const forceReload = () =>{
    router.reload();
  }

  const onNavbarContainerClick = (e:React.MouseEvent<HTMLDivElement>) =>{
    const el = e.target as HTMLDivElement;

    if(el.className.includes && el.className.includes("nav_menu")){
      setIsOpen(false);
    }

  }

  

  const getUser = async (user:User) =>{
    
    setUsername(user.username)
    if(user.profileImage.length > 0){
      setAvatar("")
      const res = await costumAxios.get(`/auth/avatar`, {responseType: 'blob'});
      let blob = new Blob([ res.data ], {type: 'image/jpeg'}) 
      const objectURL = URL.createObjectURL(blob);
      setAvatar(objectURL)
      setIsAvatarClicked(false)  
    }
  }

  useLayoutEffect(()=>{
    (async () => {
      if(user){
        await getUser(user);
      }  
    })();

  },[user])

  const onFileUpload = useCallback( async (files , err)=>{
    const file = files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    try{
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("file" , compressedFile);
      const res = await clientAxios.post("/upload/avatar", formData, {
        onUploadProgress:(data)=>{
          const loadingData =  Math.round(data.loaded / data.total * 100);
          if(loadingData === 100){
            setUploadStatus(UploadStatus.UPLOADED);
          } 
        }
      });
      if(res.status === 200){
        setUploadStatus(UploadStatus.ONSTART);
        console.log(user.username)
        if(user){
          await getUser(user)
        }
        

      }

    }catch(e){
      console.log(e)
    }      
  }, [])



  const onAvatarClick = (e:React.MouseEvent<HTMLDivElement>) =>{
    const el = e.target as HTMLDivElement;

    if(el.className  && el.className.includes && el.className.includes("avatar_impluse"))
    setIsAvatarClicked(s=>!s);
  }
  const hidePopUp = (e:React.MouseEvent<HTMLDivElement>) =>{
    setIsAvatarClicked(false);
  }

  const avatarTooltip = () => (<span>change your avatar</span>)

  return (
    <div className={styles.navbarContainer} onClick={onNavbarContainerClick}>
      <div className={styles.navbarWrapper}>

        <div className={styles.start}>  
        <motion.div
             animate={isOpen ? "closed" : "open"}
             variants={variants}
             className={styles.nav_menu_closed}
             onClick={() => setIsOpen(s => !s)}
        >
              <span>
                <CgMenu size={iconSize}/>
              </span>
              <span>LOGO</span>  
        </motion.div>
            
            <motion.nav
             animate={isOpen ? "open" : "closed"}
             variants={variants}
             className={styles.nav_menu}
            >
              
              <ul>
                <li className={styles.start_nav_opened}>
                  <span><CgClose size={iconSize} onClick={() => setIsOpen(s =>!s)}/></span>
                  <span>LOGO</span>  
              </li>
                
                <li>
                    <Link href={"/"}>
                      <a href={"#"}>  
                                      <span><AiOutlineHome size={iconSize}/></span>
                                      <span>Home</span>
                      </a>
                    </Link>
                </li>

                <li>
                  <Link href={"/profile"}>
                    <a href={"#"}>
                      <span>
                        <ImProfile size={iconSize}/>
                      </span>
                      <span>
                         Profile
                      </span>
                    </a>
                  </Link> 
                </li>
                <li>
                  <Link href={"/upload-video"}>
                    <a href={"#"}>
                      <span><TiUploadOutline size={iconSize}/></span>
                      <span>
                           Upload
                      </span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={"/history"}>
                      <a href={"#"}>
                        <span>
                          <VscHistory size={iconSize}/>
                        </span>
                        <span>
                         History
                        </span>
                      </a>
                  </Link></li>
                <li className={styles.logout}> 
                     <Button type="primary" ghost size={"large"} 
                             style={{width:"100%"}}>
                            Logout
                     </Button>

                </li>
              </ul>

            </motion.nav>
        </div>
        <div className={styles.center}>
            <Search placeholder="search" loading enterButton size={"large"} style={{width:500}}/>
        </div>

        <div className={styles.end}>
         
        {!user ? <Button type="primary" ghost size={"large"}>
                  <Link href={"/login"}>
                      <a href={"#"}>
                         Login
                      </a>
                  </Link>
                  </Button>
        :
         
        <Tooltip placement="left" title={avatarTooltip}>
        
        <div className={styles.avatarContainer} onClick={onAvatarClick}  >
            <Popover
              content={<div className={styles.uploadAvatar}>
                          {upStatus === UploadStatus.ONSTART ? 
                          <>
                          <Upload onUpload={onFileUpload} 
                           dropText='' 
                           acceptFiles={"image/*"}
                           >
                            <BsFillPersonFill size={20}/>
                          </Upload> 
                          </>
                          : 
                          <UseAnimations animation={infinity} 
                               strokeColor={"white"} 
                               size={50} 
                               style={{ padding: 150 }}
                               loop={true}
                               autoplay={true} 
                           />  
                          }
                          
                        </div>
                      }
              title={
                  <div className={styles.popup_title}>
                    <Button type="link" onClick={hidePopUp} size={"large"}>close</Button>
                    <Button danger type="link" onClick={onLogout} size={"small"} 
                    >
                          Logout
                    </Button>
                  </div>
            }
              trigger="click"
              visible={isAvatarClicked}
              placement="bottomRight"
              overlayInnerStyle={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}
              >
             {avatar.length > 0 ? 
                 <Avatar className={styles.avatar}  size={"large"} src={ <Image  src={avatar} layout="fill" />}></Avatar> 
                 
               : ""
             }
            </Popover>

   

          <motion.div 
                    className={styles.avatar_impluse}
                    initial={false}
                    whileHover={{
                      scale: [1, 2],
                      opacity:[1, 0],
                    }}
                    />
                     
          </div>
        </Tooltip>

        }
        </div>
      </div>
    </div>
  )
}


export default Navbar