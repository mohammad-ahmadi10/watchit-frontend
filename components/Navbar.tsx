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
import {IoIosSearch} from "react-icons/Io";

import Link from 'next/link'
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import costumAxios from "../utils/axios";

import {useRouter} from 'next/router'

import Image from 'next/image';
import {BsFillPersonFill} from "react-icons/bs";
import {UploadStatus} from "../utils/enums";
import {forceReload} from "../utils/functions";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {VideoPrevData} from "../types/page";


const variants = { 
  open: { opacity: 1, x: 0, transition:{stiffness: 5, staggerChildren: 0.05 } },
  closed: { opacity: 0, x: "-100%" },
}
const item = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
}


interface searchedTitleType{
  sIndex:number,
  eIndex:number,
  title:string,
  id:string
}



function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [iconSize, setIconSize] = useState(40);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [upStatus,  setUploadStatus] = useState(UploadStatus.ONSTART);
  const [user,setUser] = useState(null);
  
  const router = useRouter();
  const [token , setToken] = useState("");

  const [titles, setTitles] = useState<searchedTitleType[]>();
  const [shouldShowSearchSuggestion,setShouldShowSearchSuggestion] = useState(false);
  const [load, setLoad] = useState(false);

  // end search
  const onSearchChange = async (s:React.ChangeEvent) => {
    try{
      setLoad(false)
      const input = s.target as HTMLInputElement;
      const searchKey = input.value
      const {data} = await clientAxios.get(`${process.env.NEXT_PUBLIC_REMOTE}/watch/search_query/${searchKey}`)
        
        let modifiedTitles = [];
        if(data.length > 0){
          modifiedTitles = data.map((v:VideoPrevData) => {
            const title = v.title.toLowerCase();
            const sIndex = title.indexOf(searchKey) 
            const eIndex = sIndex+(searchKey.length)
            return {sIndex,eIndex, ...v, title}
          })
        }
        
        setTitles(modifiedTitles)
        setLoad(false)
        setShouldShowSearchSuggestion(true)
    }catch(e){
      setTitles([])
        setShouldShowSearchSuggestion(false)
        setLoad(false)
    }
  }
  
  

  const onSearch = async (s:string) =>{
        
  }

  interface costumHTMLElement extends HTMLElement{
     name?:string
  }
  const handleKeyDown = (e:React.MouseEvent) => {
      const t = e.target as costumHTMLElement;
      if(t.name && t.name.includes("search"))return;

      setShouldShowSearchSuggestion(false)
  }

  const onSearchClick = (e:any)=>{
    setShouldShowSearchSuggestion(true)
  }

  const onSearchEnter = (e:any)=>{
    const t = e.target as HTMLInputElement;
    const value = t.value;

    router.push(`/search/search-query=${value}`)
    
  }

  useLayoutEffect(() => {
    window.addEventListener('click', handleKeyDown);    
    // cleanup this component
    return () => {
      window.removeEventListener('click', handleKeyDown);
    };
  }, []);


  useLayoutEffect(() =>{
      const actoken = localStorage.getItem("ACTKEN");
      if(actoken !== null)
      setToken(actoken)
  })



  
  const onLogout = async (e:React.MouseEvent<HTMLParagraphElement>) =>{
    const response = await clientAxios.get("auth/logout");
    if(response.status === 200){
      localStorage.setItem("ACTKEN", "")
      localStorage.setItem("SSRFSH", "")
      localStorage.setItem("user" , "")
      setUser(null);
      forceReload(router)
    }
  }
  

  const onNavbarContainerClick = (e:React.MouseEvent<HTMLDivElement>) =>{
    const el = e.target as HTMLDivElement;

    if(el.className.includes && el.className.includes("nav_menu")){
      setIsOpen(false);
    }

  }

  

  const getUser = async () =>{
    const userSt = localStorage.getItem("user");
    if(userSt){
      const {user} = JSON.parse(userSt).payload;
      if(user === null) return;
      setUser(user);
      setUsername(user.username)
      setAvatar("")
      const res = await costumAxios.get(`/auth/avatar`, {responseType: 'blob'});
      let blob = new Blob([ res.data ], {type: 'image/jpeg'}) 
      const objectURL = URL.createObjectURL(blob);
      setAvatar(objectURL)
      setIsAvatarClicked(false)  
    }else{
      const token = localStorage.getItem("ACTKEN");
      if(token){
        setTimeout(() =>{
          forceReload(router); 
        }, 250)
      }
    }
  }

  useLayoutEffect(()=>{
    (async () => { 
        await getUser();
    })();
  },[])
 


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
        await getUser()
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
             initial="closed"

             animate={isOpen ? "closed" : "open"}
             variants={variants}
             className={styles.nav_menu_closed}
             onClick={() => setIsOpen(s => !s)}
        >
              <span>
                <CgMenu size={iconSize}/>
              </span>
                   <span>
                   <Link href={"/"}>
                      <a href={"#"}>  
                                      <span>LOGO</span>
                      </a>
                    </Link>  
                   </span>
                   
        </motion.div>
            
            <motion.nav
             animate={isOpen ? "open" : "closed"}
             variants={variants}
             initial="closed"
             className={styles.nav_menu}
            >
              
              <motion.ul
                     animate={isOpen ? "open" : "closed"}
                     variants={variants}
                     initial="closed"
              >
                <motion.li variants={item}  className={styles.start_nav_opened}>
                  <span><CgClose size={iconSize} onClick={() => setIsOpen(s =>!s)}/></span>
                  <span>LOGO</span>  
              </motion.li>
                
                <motion.li variants={item}>
                    <Link href={"/"}>
                      <a href={"#"}>  
                          <span><AiOutlineHome size={iconSize}/></span>
                          <span>Home</span>
                      </a>
                    </Link>
                </motion.li>

                <motion.li variants={item} >
                  <Link href={`/user/${username}`}>
                    <a href={"#"}>
                      <span>
                        <ImProfile size={iconSize}/>
                      </span>
                      <span>
                         Profile
                      </span>
                    </a>
                  </Link> 
                </motion.li>
                <motion.li variants={item} >
                  <Link href={"/upload-video"}>
                    <a href={"#"}>
                      <span><TiUploadOutline size={iconSize}/></span>
                      <span>
                           Upload
                      </span>
                    </a>
                  </Link>
                </motion.li>
                <motion.li variants={item} >
                  <Link href={"/history"}>
                      <a href={"#"}>
                        <span>
                          <VscHistory size={iconSize}/>
                        </span>
                        <span>
                         History
                        </span>
                      </a>
                  </Link></motion.li>
                <motion.li variants={item}  className={styles.logout}> 
                     <Button type="primary" onClick={onLogout} ghost size={"large"} 
                             style={{width:"100%"}}>
                            Logout
                     </Button>

                </motion.li>
              </motion.ul>

            </motion.nav>
        </div>
        <div className={styles.center}>
            <Search placeholder="search..." loading={load} size={"large"} 
                                        
                                         onSearch={onSearch} 
                                         onChange={onSearchChange}
                                         allowClear
                                         className={styles.search}
                                         onClick={onSearchClick}
                                         onPressEnter={onSearchEnter}
                                         name={"search"}
                                         
                                         />
           {shouldShowSearchSuggestion && <div className={styles.search_items}> 
                  {titles !== null && typeof titles !== "undefined" && titles.map((s,k) =>  
                                      {

                                        return  <span key={k}><Link href={`/search/search-query=${s.title}`} >
                                                      <a href={"#"}>
                                                         <span>
                                                          
                                                          {s.title.slice(0,s.sIndex)}
                                                          <strong>{s.title.slice(s.sIndex,s.eIndex)}</strong>
                                                          {s.title.slice(s.eIndex)}
                                                         </span>
                                                         <IoIosSearch size={25} style={{color:"black", marginRight:"5px"}}/>
                                                      </a>
                                                </Link></span>
                                     }
                              )
                                  
                 }
            </div>
           }
        </div>

        <div className={styles.end}>
         
        {user === null || token === null || token.length <= 0 ? 
                <Button type="primary" ghost size={"large"}>
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