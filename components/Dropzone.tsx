import { DependencyList, useCallback} from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import styles from "../styles/dropzone.module.scss";

/* property types for Dropzone */
interface DropzoneProps {
  onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void,
  dropText:string,
  accept:string,
  children?:React.ReactNode
}


const Dropzone:React.FC<DropzoneProps> = ({onDrop , dropText, accept  , children}) => {
  
  
  const {getRootProps , getInputProps , 
        isDragActive
        }
  = useDropzone({onDrop, accept});


  return (
    <div className={styles.dropZone_container} {...getRootProps()}>
        <input {...getInputProps()} />
        {
          /* isDragActive?
                <p>Drop the file here ....</p>
            :   <div> 
                    <p>{dropText}</p>
                </div> */
                children ? children : "drop or Drag a file"
        }
    </div>
  )
}

export default Dropzone
