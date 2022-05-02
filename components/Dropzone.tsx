import { DependencyList, useCallback} from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import styles from "../styles/dropzone.module.scss";

/* {onDrop  ,  children , isImg=false , loading , fontSize=100} */
interface DropzoneProps {
  onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void,
  dropText:string 
}

const accept = "image/*,video/*"
const Dropzone:React.FC<DropzoneProps> = ({onDrop , dropText}) => {
  
  
  const {getRootProps , getInputProps , 
        isDragActive
        }
  = useDropzone({onDrop, accept , });


  return (
    <div className={styles.dropZone_container} {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive?
                <p>Drop the file here ....</p>
            :   <div> 
                    <p>{dropText}</p>
                </div>
        }
    </div>
  )
}

export default Dropzone
