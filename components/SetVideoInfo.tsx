import {useState,useCallback} from 'react'
import ThumbGalleryPopup from './../components/ThumbGalleryPopup';
import uploadPNG from "../public/uploader.png";
import "antd/dist/antd.dark.css"
import { Popover,  Form, Input , Button, Divider, notification} from 'antd';
import styles from "../styles/SetVideoInfo.module.scss";
import { CloseOutlined } from '@ant-design/icons';
import Videoplayer from "./Videoplayer";
import { NextPageContext } from "next";
import clientAxios from "../utils/axios";
import axios from "axios";
import { StaticImageData } from 'next/image';
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity"
import Router from 'next/router'
import { motion } from "framer-motion"
import { IconType } from 'antd/lib/notification';

interface SetVideoInfoProps{
    uploadedPath:string
}
interface FormType{
  video:{Title:string, Description:string}
}




const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};


const openNotificationWithIcon = (type:IconType) => {
  notification[type]({
    message: 'upload file',
    description:
      'video is successfully uploaded!',
    duration:1,
    placement:'topRight',
    className:"notification"
  });
};



enum UploadStatus{
  ONSTART,UPLOADED
}

interface MetadataType {
  id:string,
  view:number,
  title:string,
  description:string,
  duration:number,
  data:Date,
  resolution:string[],
  like:number,
  username:string,
  userID:string
}

const SetVideoInfo = ({uploadedPath}:SetVideoInfoProps) => {
    const [upStatus,  setUploadStatus] = useState(UploadStatus.ONSTART);
    const [uploadFile, setUploadFile] = useState<string|StaticImageData>(uploadPNG);
    const [file, setFile] = useState<File>();
    const [metadata , setMetadata] = useState<MetadataType | null >(null);

    const [imgIndex, setImgIndex] = useState(1);
    const [load, setLoad] = useState(false);
    const [title,setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exitVisible, setExitVisible] = useState(false);
    const [exit, setExit] = useState(false);


    const hide = () =>{
      setExitVisible(false)
    }
    
    const onVisibleChange = (visible:boolean) =>{
      setExitVisible(visible)
    }


    const onImageUpload = useCallback( async (files , err)=>{
        const file = files[0];
        setFile(file);

        const reader = new FileReader();
        reader.onload = () =>{
          if(reader.readyState === 2){
            const result = reader.result;
            if(typeof result === 'string')
               setUploadFile(result);
          }
        }
        reader.readAsDataURL(file);
      }, [])

      const selectImageIndex = (n:number) =>{
        if(n !== -1 && typeof uploadFile === "string"){
          setUploadFile(uploadPNG)
        }
        setImgIndex(n);
      }



const onExit = async (e:React.MouseEvent) =>{
    console.log("close")
    /* upload/rmvideo */ 
    try {
       
      const res = await clientAxios.post(`upload/rmvideo/`, {
        id:uploadedPath
      });
      const result = res.data;
      setExit(true);
      setMetadata(null)
      setTimeout(() =>{
        Router.push("/upload-video")
      }, 500)

      
     } catch (error) {
       if(axios.isAxiosError(error)){
         console.log(error)
       }
     }
}

useLayoutEffect(()=>{
  if(upStatus === UploadStatus.UPLOADED){
  {openNotificationWithIcon('success')}
  }
}, [upStatus])




const onFinish = async (e:React.MouseEvent) => {
  
  setLoad(true)

  if(imgIndex !== -1){
    
    const res = await clientAxios.post("/upload/thumb/index", {
        videoPath:uploadedPath,
        title,
        description,
        index:imgIndex+1
    })

    setLoad(false)
    setUploadStatus(UploadStatus.UPLOADED)
    setTimeout(() =>{
      Router.push("/")
    }, 500)


 }else{
    const formData = new FormData();
    formData.append("videoPath", uploadedPath)
    formData.append("title", title);
    formData.append("description", description);
    if(file)
    formData.append("file" , file);
    const res = await clientAxios.post("/upload/thumb" , formData);
    setLoad(false)
    setUploadStatus(UploadStatus.UPLOADED)
     setTimeout(() =>{
      Router.push("/")
    }, 500)
 }
};


useLayoutEffect( ()=>{
     (async () =>{
      try {
       
        const res = await clientAxios.get(`watch/metadata/${uploadedPath}`);
        const result:MetadataType = res.data;
        setMetadata(result);
       
       } catch (error) {
         if(axios.isAxiosError(error)){
           console.log(error)
         }
       }
     })()
     

},[])



const onTitleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
  const inputElement = e.target as HTMLInputElement;
 
  setTitle(inputElement.value.toLowerCase())
}

const onDescriptionChange = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
  const inputElement = e.target as HTMLTextAreaElement;
  setDescription(inputElement.value)
}

const popupVariants = {
  fadeIn:{
    opacity:1,
    scale:1
  },
  fadeOut:{
    opacity:0,
    scale:0,
    transition:{duration:3}
  }
}

  return (
    <>
    {
      metadata ? 
      <motion.div variants={popupVariants}
                  initial="fadeIn"
                  animate={exit && "fadeOut"}
      >
      <section className={styles.videoInfoContainer}>

      {/* start */}
          <div className={styles.videoInfoWrapper}>
          <div className={styles.videoCancelContainer}>
      <Popover
        content={<div className={styles.popContentContainer} onClick={hide}>
          <span>You are almost done with uploading your video! </span> 
          <div className={styles.cancelContainer}>
          <span>Are You Sure ?</span>
          <Button type="text" size="small"  danger onClick={onExit}>
                EXIT
          </Button>
          </div>
         
        </div>}
        title="Exit"
        trigger="click"
        visible={exitVisible}
        onVisibleChange={onVisibleChange}
      >
          <div className={styles.closeButton}>
              <motion.button
               whileHover={{ scale: 1.2 }}
               whileTap={{ scale: 0.8 }}
               style={{background:"transparent", border:0, cursor:"pointer"}}
                >
               <CloseOutlined  style={{fontSize:25, color:"red"}} />
               </motion.button>
          </div>
          
      </Popover>
      </div>
          <div className={styles.upperContainer}>
            <div className={styles.formWrapper}>
            <Form {...layout} name="nest-messages"> 
            
            <Form.Item name={['video', 'Title']}   rules={[
                {
                  required: true,
                  message: 'Please input title of the video!',
                },
              ]}>
              <Input onChange={onTitleChange} placeholder="Title"/>
            </Form.Item>
            <Form.Item name={['video', 'Description']} 
             rules={[
               {
                 required: true,
                 message: 'Please write some description!',
                },
              ]}
              
              >
                
              <Input.TextArea  onChange={onDescriptionChange} placeholder="Description" />
            </Form.Item>
            </Form>
            </div>
            {
              metadata && 
              <div className={styles.videoInfoPlayerWrapper}>
             

                   <Videoplayer duration={metadata.duration!}  
                                videoPath={uploadedPath} 
                                title={metadata.title!}
                                
                                
                    /> 
            </div>
              
            }
            {/* <Videoplayer duration={metadata.duration}  videoPath={videoId}/> */}
          </div>
      {/* End */}
      <Divider orientation={"left"} style={{color:"white"}} plain>Select a thumb for the Video</Divider>
          <ThumbGalleryPopup onImageUpload={onImageUpload}  
                         uploadFile={uploadFile} 
                         videoID={uploadedPath}
                         selectImageIndex={selectImageIndex}            
          />
              <Button type="default" htmlType="submit" loading={load} onClick={onFinish} ghost={true} size={"large"}   style={{width:"100%", marginTop:"20px"}}
              >
                Upload
              </Button>
          </div>

              
            </section>
            </motion.div>
            :

            <div className={styles.loadingWrapper}>      
                <div className={styles.infinity}>
            <UseAnimations animation={infinity} 
            strokeColor={"white"} 
            size={100} 
            style={{ padding: 150 }}
            loop={true}
            autoplay={true} 
            />  
          </div>
          </div>
                   
    }
    </>
  )
}



export default SetVideoInfo