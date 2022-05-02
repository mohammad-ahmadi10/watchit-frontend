import React from 'react'
import Upload from '../components/Upload';
import styles from "../styles/uploadVideo.module.scss";
import { useCallback } from 'react';
import clientAxios from "../utils/axios";
import { useState } from 'react';

const  uploadVideo = () => {
  const [uploaded , setUploaded] = useState(0);
  const onFileUpload = useCallback( async (files , err)=>{
    
    const formData = new FormData();
    formData.append("file" , files[0]);
      const res = await clientAxios.post("/upload/video", formData, {
        onUploadProgress:(data)=>{
          const loadingData =  Math.round(data.loaded / data.total * 100);
          setUploaded(loadingData);
        }
      });
   

  }, [])

  return (
    <section className={styles.uploadVideo_container}>
      <div className={styles.upload_wrapper}>
        <Upload onUpload={onFileUpload} dropText='Drop or Select a video'/>
     
      {
        uploaded === 0 ? 
        <div className={styles.progress_cotainer} >
          <div
              className={styles.progress_bar} 
              role='progressbar'
              aria-valuenow={uploaded}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{width: `${uploaded}%`}}
          >
              <div>{`${uploaded}%`}</div>
          </div>
      </div>
      :
      ""
      }
       </div>
    </section>
  )
}

export default uploadVideo