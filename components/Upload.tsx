import Dropzone from "../components/Dropzone";
import styles from "../styles/upload.module.scss";
import { useCallback } from 'react';
import { useState } from 'react';

interface UploadProps{
    dropText:string,
    onUpload:(files: any, err: any) => void,
    acceptFiles:string,
    children?:React.ReactNode
}

const Upload:React.FC<UploadProps> = ({dropText, onUpload, acceptFiles, children})  =>{    
  
  return (
    <section className={styles.upload_container}>
        <Dropzone onDrop={onUpload} dropText={dropText} accept={acceptFiles}>
          {children}
        </Dropzone>
    </section>
  )
}

export default Upload