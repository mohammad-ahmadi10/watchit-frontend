import Upload from "./Upload";
import styles from "../styles/ImageUploader.module.scss";

interface ImageUploaderProps{
  onImageUpload:(files: any, err: any) => void,
  children:React.ReactNode

}

const ImageUploader:React.FC<ImageUploaderProps> = ({onImageUpload, children}) => {

  return ( 
    <div className={styles.imageUploaderContainer}>
 <Upload
    acceptFiles={"image/*"}
    dropText="png,jpeg"
    onUpload={onImageUpload}
  >
    {children}
    
  </Upload>
    </div>
   
  );
};

export default ImageUploader;