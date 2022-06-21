import Upload from '../components/Upload';
import styles from "../styles/uploadVideo.module.scss";
import { useCallback , useState} from 'react';
import clientAxios from "../utils/axios";
import {Progress, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity"
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import { IconType } from 'antd/lib/notification';
import "antd/dist/antd.dark.css"
import SetVideoInfo from '../components/SetVideoInfo';
import {UploadStatus} from "../utils/enums";
import {CgLogIn} from "react-icons/cg";
import Link from 'next/link'

const openNotificationWithIcon = (type:IconType) => {
  notification[type]({
    message: 'upload file',
    description:
      'video is successfully uploaded!',
    duration:5,
    placement:'topRight',
    className:"notification"
  });
};




const  uploadVideo = () => {
  const [upStatus,  setUploadStatus] = useState(UploadStatus.ONSTART);
  const [uploadedPath, setUploadedPath] = useState("1652027776529KGXARatk");
  const [progressPercent , setProgressPercent] = useState(0);
  const [popup, setPopup] = useState(false);
  const [user , setUser] = useState("")


  const onFileUpload = useCallback( async (files , err)=>{
    const formData = new FormData();
    formData.append("file" , files[0]);
      const res = await clientAxios.post("/upload/video", formData, {
        onUploadProgress:(data)=>{
          const loadingData =  Math.round(data.loaded / data.total * 100);
          setProgressPercent(loadingData);
          if(loadingData === 100){
            setUploadStatus(UploadStatus.UPLOADED);
          } 
        }
      });
      if(res.status === 200){
        setUploadedPath(res.data.videoPath)
        setUploadStatus(UploadStatus.ONSTART);
        setPopup(true);
        setProgressPercent(0);
      }
  }, [])



  useLayoutEffect(()=>{
      if(upStatus === UploadStatus.UPLOADED){
      {openNotificationWithIcon('success')}
      }
  }, [upStatus])

  useLayoutEffect(()=>{
      const u = localStorage.getItem("user");
      if(u){
        const user = JSON.parse(u);
        setUser(u)
      }else setUser("")
      
  }, [])

  return (
 
      <>

      {
        user.length > 0 ? 

        <div className={styles.uploadVideoWrapper}>
           {
            upStatus === UploadStatus.UPLOADED ?
            <div className={styles.uploadVideo_container}>
            <div className={styles.upload_wrapper}>      
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
            </div>    
          :
          <section className={styles.uploadVideo_container}>
            <div className={styles.upload_wrapper}>
            
            <Upload onUpload={onFileUpload} 
                    dropText='Drop or Select a video' 
                    acceptFiles={"video/*"}
            >
             <UploadOutlined style={{fontSize:100}}/>

            </Upload>
          {
              upStatus === UploadStatus.ONSTART && progressPercent > 0? 
                 <div className={styles.progressBar}>
                  <Progress percent={progressPercent} status="active" 
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}        
                            trailColor={"white"}
                            strokeLinecap={"square"} 
                            type={"line"}
                            size={"small"}        
                  />
              </div>
      :
      ""       
          }
          </div>
        </section>
        } 
        {
          !popup ?     
          <div className={styles.setVideoInfoWrapper}>
             <SetVideoInfo
                 uploadedPath={/* uploadedPath */ "1655537151486Leau-OYj"}
              />
          </div>        
          
         :""
        }
    </div>
     
     : 

     <div className={styles.login}>
                   <span>Login in order to upload your videos</span>

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
    </>
  )
}

export default uploadVideo
