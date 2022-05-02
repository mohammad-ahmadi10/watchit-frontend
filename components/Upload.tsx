import Dropzone from "../components/Dropzone";
import styles from "../styles/upload.module.scss";
import { useCallback } from 'react';
import { useState } from 'react';

interface UploadProps{
    dropText:string,
    onUpload:(files: any, err: any) => void
}

const Upload:React.FC<UploadProps> = ({dropText, onUpload})  =>{
    const [file , setFile] = useState(null);
    

  return (
    <section className={styles.upload_container}>
        <Dropzone onDrop={onUpload} dropText={dropText}/>
    </section>
  )
}

export default Upload