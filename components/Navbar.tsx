import { Input , Avatar, Popover , Progress, Tooltip} from 'antd';
const { Search } = Input;
import {useState , useCallback, useRef} from "react";
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
import {IoIosSearch} from "react-icons/io";
import {MdOutlineClear , MdOutlineListAlt} from "react-icons/md";
import Link from 'next/link'
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import costumAxios from "../utils/axios";

import {useRouter} from 'next/router'

import Image from 'next/image';
import {BsFillPersonFill} from "react-icons/bs";
import {UploadStatus} from "../utils/enums";
import {forceReload, finduserIfExists} from "../utils/functions";
import {VideoPrevData} from "../types/page";
import { useDispatch, useSelector } from 'react-redux';
import { setAvatar } from '../src/features/avatarSlice';
import { selectAvatar } from '../src/store';
import Logo from "../public/Logo.svg"
import UserLogo from "../public/user.png";

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
interface UserType{id:string,username:string,email:string,profileImage:string}

const  Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [iconSize, setIconSize] = useState(40);
  const [username, setUsername] = useState("");
  const [avatar, setAvatarPath] = useState("");
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [upStatus,  setUploadStatus] = useState(UploadStatus.ONSTART);
  const [user,setUser] = useState<UserType | null>(null);
  const [query , setQuery] = useState("");

  const router = useRouter();
  const [token , setToken] = useState("");

  const [titles, setTitles] = useState<searchedTitleType[]>();
  const [shouldShowSearchSuggestion,setShouldShowSearchSuggestion] = useState(false);
  const [load, setLoad] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [oldScrolled, setOldScrolled] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [routerPath , setRouterPath] = useState(router.pathname.split("/")[1])

  const dispatch = useDispatch();
  const selector = useSelector(selectAvatar);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  

  

  useLayoutEffect(()=>{
    if(typeof window !== 'undefined' && window !== null ){
      const val = localStorage.getItem("q")
        val ? setSearchVal(val) : setSearchVal("")
    }
  }, [])
  // end search
  const onSearchChange = async (s:React.ChangeEvent) => {
    try{
      setLoad(false)
      const input = s.target as HTMLInputElement;
      const searchKey = input.value
      setSearchVal(searchKey);

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
  
  useLayoutEffect(() =>{
     const q = localStorage.getItem("q");
     if(q !== null && typeof q !== "undefined")
      setQuery(q);
  }, []) 

  const onSearch = async (s:string) =>{  
    if(s.length <= 0) return;
    localStorage.setItem("q" , s);

    router.push(`/search/search-query=${s}`)
  }


  interface costumHTMLElement extends HTMLElement{
     name?:string
  }
  const handleKeyDown = (e:any) => {
      const t = e.target as costumHTMLElement;
      if(t.name && t.name.includes("search"))return;

      setShouldShowSearchSuggestion(false)
  }

  const handleScroll = (e:any) =>{
      const lp = window.scrollY;
      const oldScroll = localStorage.getItem("oldScroll")
      if(oldScroll !== null){
        if((+lp )> (+oldScroll)){
          setIsScrolled(true)
        }
        else{
          setIsScrolled(false)
        }
        localStorage.setItem("oldScroll", lp.toString())
      }
      
  } 


  const onSearchClick = (e:any)=>{
    setShouldShowSearchSuggestion(true)
  }

  const onSearchEnter = (e:any)=>{
    const t = e.target as HTMLInputElement;
    const value = t.value;
    if(value.length <= 0) return;
    localStorage.setItem("q" , value);

    router.push(`/search/search-query=${value}`)
    
  }

  useLayoutEffect(() => {
    window.addEventListener('click', handleKeyDown);

    window.addEventListener('scroll', handleScroll)

    // cleanup this component
    return () => {
      window.removeEventListener('click', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);

    };
  }, []);


  useLayoutEffect(() =>{
      const actoken = localStorage.getItem("ACTKEN");
      const isAvatar = localStorage.getItem("avatar");
      if(actoken !== null)
      setToken(actoken)
  })


  useLayoutEffect(() =>{      
    if(selector.page.length > 0)
      setAvatarPath(selector.path)
  })
  useLayoutEffect(() =>{      
    localStorage.setItem("oldScroll", "0")
  }, [])





  
  const onLogout = async (e:React.MouseEvent<HTMLParagraphElement>) =>{
    const response = await clientAxios.get("auth/logout");
    if(response.status === 200){
      localStorage.setItem("ACTKEN", "")
      localStorage.setItem("SSRFSH", "")
      localStorage.setItem("user" , "")
      setUser(null);
      setTimeout(()=>{
        router.push("/")

      }, 700)
    }
  }
  

  const onNavbarContainerClick = (e:React.MouseEvent<HTMLDivElement>) =>{
    const el = e.target as HTMLDivElement;

    if(el.className.includes && el.className.includes("nav_menu")){
      setIsOpen(false);
    }

  }

 
  


  const getUser = async ( ) =>{
    if(finduserIfExists){
      const {user , objectURL} = await finduserIfExists(router , costumAxios);
      console.log(user)
      if(user){
        setUser(user);
        setUsername(user.username)
        setAvatarPath("")
        setAvatarPath(objectURL)
        setIsAvatarClicked(false)
        dispatch(setAvatar({
          path:objectURL.toString(),
          page:"navbar"
        }))
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

  const avatarTooltip = () => (<span>{user !== null  && user.profileImage.length > 0 ? "change your avatar" : "set your avatar"}</span>)


  const onClearClick = (e:React.MouseEvent<HTMLSpanElement>) =>{
       localStorage.setItem("q", "")
       setSearchVal("")
  }

  return (
    <div className={`${styles.navbarContainer} ${isScrolled && !isOpen ? styles.scrolled_nav : ""}`} onClick={onNavbarContainerClick}>
      <div className={styles.navbarWrapper}>

        <div className={styles.start}>  
        <motion.div
             initial="closed"

             animate={isOpen ? "closed" : "open"}
             variants={variants}
             className={styles.nav_menu_closed}
             onClick={() => {setIsOpen(s => !s)}}
        >
              <span>
                <CgMenu size={iconSize}/>
              </span>
                   <span>
                   <Link href={"/"}>
                      <a href={"#"}>  
                                      <Image src={Logo} alt={"logo"} width={80} height={80}/>
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
                  <span><CgClose size={iconSize} onClick={() => {setIsOpen(s =>!s);}}/></span>
                  <span>                                      <Image src={Logo} alt={"logo"} width={70} height={70}/>
</span>  
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

                  <Link href={`/user/${username ? username : "undefined"}`}>
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
                  <motion.li variants={item} >
                  <Link href={`/playlist`}>
                      <a href={"#"}>
                        <span>
                          <MdOutlineListAlt size={iconSize}/>
                        </span>
                        <span>
                         Playlist
                        </span>
                      </a>
                  </Link></motion.li>
                {user ? <motion.li variants={item}  className={styles.logout}> 
                     <Button type="primary" onClick={onLogout} ghost size={"large"} 
                             style={{width:"100%"}}>
                            Logout
                     </Button>
                </motion.li>
                : 
                ""
                }
              </motion.ul>

            </motion.nav>
        </div>
        <div className={styles.center} ref={inputContainerRef}>
            {searchVal.length > 0 && <span className={styles.clearIcon} onClick={onClearClick} >
                <MdOutlineClear size={20} color={"rgba(256,256,256,0.4)"} />
            </span>}
                                                        
            <Search placeholder="search..." loading={load} size={"large"} 
                                       
                                         onSearch={onSearch}
                                         value={searchVal ? searchVal : ""} 
                                         onChange={onSearchChange}
                                         className={styles.search}
                                         onClick={onSearchClick}
                                         onPressEnter={onSearchEnter}
                                         name={"search"}
                                         />
           {shouldShowSearchSuggestion && <div className={styles.search_items}> 
                  {titles !== null && typeof titles !== "undefined" && titles.map((s,k) =>  
                                      {
                                        return  <span key={k}><Link href={`/search/search-query=${s.title}`} >
                                                      <a href={"#"} onClick={() => localStorage.setItem("q", s.title)}>
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
        <>
        {
          routerPath.length > 0 ?
          <Button type="primary" ghost size={"large"}>
          <Link href={`${routerPath === "login" ? "/register"   : "/login" }`}>
              <a href={"#"}>
                 {routerPath === "login" ? "register"   : "login"}
              </a>
          </Link>
          </Button>
          : 

          <>
          <Button type="text" size={"large"}>
                  <Link href={"/register"}>
                      <a href={"#"}>
                         register
                      </a>
                  </Link>
                </Button>
                <Button type="primary" ghost size={"large"}>
          <Link href={"/login"}>
              <a href={"#"}>
                 login
              </a>
          </Link>
          </Button>
          </>
        }
        </>
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
                
                 <Avatar className={styles.avatar}  size={"large"} src={ <Image  src={ user.profileImage.length > 0 ?  avatar : UserLogo} layout="fill" />}></Avatar> 
                 
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