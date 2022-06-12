import React, {  useState } from 'react'
import { useRouter } from 'next/router'
import {  GetServerSideProps } from 'next'
import costumAxios from "../../utils/axios";
import {UserData} from "../../types/page"
import styles from "../../styles/user.module.scss"
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../../utils/functions";
import Link from 'next/link'
import Image from 'next/image';
import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {BiCheckShield } from "react-icons/bi";
import {ImUpload2} from "react-icons/im";
import imageCompression from 'browser-image-compression';
import {  Avatar } from 'antd';
import userPNG from "../../public/user.png";

import useLayoutEffect from "../../utils/IsOrmorphicLayoutEffect";
import {finduserIfExists} from "../../utils/functions";
import { useDispatch, useSelector } from 'react-redux';
import { setAvatar } from '../../src/features/avatarSlice';
import { selectAvatar } from '../../src/store';
import {AiOutlineUser} from "react-icons/ai"
import {MdAlternateEmail} from "react-icons/md";
import {CgLogIn} from "react-icons/cg";
import { Input , Form , Button , notification, Popover   } from 'antd';
import {forceReload} from "../../utils/functions";
import { login  } from '../../src/features/userSlice';
import {VscWorkspaceTrusted} from "react-icons/vsc";
import {RiEdit2Line} from "react-icons/ri";
import {VideoPrevData} from "../../types/page"

interface UserProps{
    username:string
}

const openNotification = (content:React.ReactNode) => {
  notification.open({
    message: content,
    style: {
      width: 300,
    },
  });
}


  


const  User =({username}:UserProps) => {
  const router = useRouter()
  const [user, setUser] = useState<UserData|null>(null)
  const [avatar, setAvatarPath] = useState("");
  const [isAvatarHover , setIsAvatarHover] = useState(false);
  const [iconSize , setIconSize] = useState(40);
  const [videos , setVideos] = useState<VideoPrevData[]>([]);
  const dispatch = useDispatch();
  const selector = useSelector(selectAvatar);

  useLayoutEffect(() =>{    
    if(selector.page.length > 0)
      setAvatarPath(selector.path)
  })

/* render icon from react-icons */
const displayIcon = (ICON:any, color?:string, size?:number) =>  { 
  return  <ICON size={size ? size : iconSize} style={{pointerEvents:"none", color:color}}/>
}


const onBookmarkClicked = (_:any) =>{
        
}

const myLoader=({src}:any)=>{
  return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
}

/* 
 displays every video thumb which is got back from API
 @file: VideoPrewData 
        is an object von type VideoPrewData 
*/
const displayImage = (file:VideoPrevData , ref?:any) =>{
  const [minute, second] = regularTime(file.duration);
  
  return <div ref={ref ? ref : null}  key={file.id}  id={file.id} className={styles.gridChild} >
    <Link href={`/video/edit/${file.id}`}>
  <a href="#" className={styles.thumbContainer}>
    <div className={styles.img_wrapper}>
       <Image loader={myLoader} 
            src={`${file.id}`} alt={file.id} layout="fill"
        />
        <div className={styles.duration_container}>
         <span>{minute}</span>
         :
         <span>{second}</span>
      </div>
    </div>

   <div className={styles.videoInfoContainer}>
     <span>{file.title}</span>
     <div className={styles.usernameContainer}>
       <span>{file.username}</span>
       <BiCheckShield size={18} style={{color:"green"}}/>
     </div>
     <div className={styles.view_dateContainer}>
          <span>{modifyAmountOfView(/* +file.view */ 20)}</span>
          <span>{modifyUplodedDate(new Date(file.date))} </span>
     </div>
    </div>
  </a>
</Link>
</div>
}



  useLayoutEffect(() =>{
    (async () =>{
        try{
            const {data} = await costumAxios.get(`/auth/me`)
            setUser(data.modifiedUser)
        }
        catch(e){
            setUser(null)
        }
    })()
  }, [username])

    

  const getUser = async ( ) =>{
      const {user , objectURL} = await finduserIfExists(router , costumAxios);
      if(user){
        setUser(user);
        setAvatarPath("")
        setAvatarPath(objectURL)
        dispatch(setAvatar({
            path:objectURL.toString(),
            page:"profile"
        }))
      }
  } 


  useLayoutEffect(() =>{
 
    ( async () =>{
       const {data} = await costumAxios.get("/watch/myVideos");
       setVideos(data);
    })();
  }, [])

  useLayoutEffect(()=>{
    (async () => { 
        await getUser();
    })();
  },[])

  const onImageEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsAvatarHover(true)
  };
  const onImageLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsAvatarHover(false)
  };



  const onInputChange = async (e:React.ChangeEvent<HTMLInputElement>) =>{
     const targ = e.target as HTMLInputElement;
     const file = targ !== null && targ.files !== null &&  targ.files.length > 0 ? targ.files[0] : null

     const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
     }

     if(file !== null && file.type && file.type.includes("image")){
        try{
            const compressedFile = await imageCompression(file, options);
            const formData = new FormData();
            formData.append("file" , compressedFile);
            const res = await costumAxios.post("/upload/avatar", formData);
            if(res.status === 200){
              await getUser()
            }
          }catch(e){
            console.log(e)
          } 


     }
  }

  
  
  const  capitalize = (s:string) => (s[0].toUpperCase() + s.slice(1));
   

    const onFinish = async ({username}: {username:string, email:string}) => {
      
      const {data} = await costumAxios.put("/auth/user/edit", {username:username})
      if(data.success){
        if(typeof username !== "undefined"){
          openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "green")} <span style={{marginLeft:10}}>username was successfully edited</span></div>)
          setTimeout(()=>{
            router.push(`/user/${username}`)
          }, 1000)

        }else {
          openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "red")} <span style={{marginLeft:10}}>not able to edit the username</span></div>)
        }
      }


    };
  
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };



    const onAccountDelete = (e:any) =>{

    }


    const deleteAccount = (
      <div>
        <p>your all shared video will be removed as Well!</p>
        <Button onClick={onAccountDelete}  style={{width:"100%"}}>DELETE</Button>
      </div>
    );


  return (
    <div className={styles.user_container}>
        {
            typeof username !== 'undefined'  ? 

  
          <div className={styles.user_wrapper}>
              <div className={styles.profile} >
                <div className={styles.avatar_container}>
                  <Avatar className={styles.avatar}  size={"large"} style={{width:"200px", height:"200px"}} src={ <Image  src={avatar.length > 0 ? avatar : userPNG} layout="fill" />}></Avatar> 
                  <div  className={`${isAvatarHover ? styles.avatar_layer_hover : styles.avatar_layer  }`}
                        onMouseEnter={onImageEnter} onMouseLeave={onImageLeave}>
                           <label htmlFor="upload">
                           </label>
                           <input  
                                  type="file" name="photo" 
                                  className={styles.upload} 
                                  accept="image/png, image/jpeg" 
                                  onChange={onInputChange}
                            />
                        </div>
                  <div className={styles.avatar_ring}></div>
                  <div className={styles.avatar_ring}></div>
                  { isAvatarHover ?  
                    <div className={styles.avatar_uploader} >
                        
                           <span><ImUpload2 size={25} style={{color:"rgba(256,256,256,0.5)", pointerEvents:"none"}}/> 
                           </span>
                           <span style={{color:"rgba(256,256,256,0.5)"}}>upload</span>
                    </div>
                    : ""
                  }
                </div> 

                <div className={styles.info}>                    
                       <Form
                         name="basic"
                         labelCol={{ span: 8 }}
                         wrapperCol={{ span: 22 }}
                         initialValues={{ remember: true }}
                         onFinish={onFinish}
                         onFinishFailed={onFinishFailed}
                         autoComplete="off"
                        >
                         <Form.Item name="username">
                         <Input size="large" placeholder={capitalize(username)} prefix={<AiOutlineUser size={30} />} />
                          </Form.Item>
                          <Form.Item name="email" rules={[{ type: 'email' }]}>
                          <Input disabled value={user !== null ? capitalize(user.email) : "example@email.com"} size="large" placeholder={user !== null ? capitalize(user.email) : "example@email.com"} prefix={<MdAlternateEmail size={30} />} />
                          </Form.Item>
                          <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
                            <Button type="primary" ghost htmlType="submit" size={"large"} style={{width:"100%"}}>
                              Edit
                            </Button>
                          </Form.Item>
                        </Form>
                       <Form
                         name="basic"
                         labelCol={{ span: 8 }}
                         wrapperCol={{ span: 22 }}
                         initialValues={{ remember: true }}
                         autoComplete="off"
                        >
                          <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
                          <Popover content={deleteAccount} title="delete" trigger="click">
                                     <Button type="danger" ghost htmlType="submit" size={"large"} style={{width:"100%"}}>
                                          Delete acount
                                      </Button>
                                   </Popover>
                            
                          </Form.Item>
                        </Form>
                        
                            
                </div>



              </div>

                   <div className={styles.gridWrapper} >
                     {typeof videos  !== 'undefined' && videos.length > 0 && videos.map(v =>(
                       displayImage(v)
                     ))}
                   </div>
     

          </div>
          : <div className={styles.login}>
                   <span>Login in order to see your Profile</span>

                   <Link href={`/login`}>
                    <a href={"#"}>
                      <span>
                        <CgLogIn size={35}/>
                      </span>
                      <span>
                         Login
                      </span>
                    </a>
                  </Link> 
          </div>
        }
    </div>
   
  )
}


export const getServerSideProps:GetServerSideProps  = async (c) =>{
    const user = c.query.username
    
    if(user){
        return {
           props:{
            username:user
           } 
        }        
    }
    return {
      props:{
        username:""
      }
    }
}






export default User