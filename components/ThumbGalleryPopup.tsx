import React,{useRef, useState} from 'react'
import ImageUploader from "../components/ImageUploader"
import Image, { StaticImageData } from 'next/image'
import styles from "../styles/thumbGalleryPopup.module.scss";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";


/* property types for Gallery popup window */
interface ThumbGalleryPopupProps{
  onImageUpload:(files: any, err: any) => void,
  uploadFile:string|StaticImageData,
  videoID:string,
  selectImageIndex:(n:number) =>void
}



const ThumbGalleryPopup:React.FC<ThumbGalleryPopupProps> = ({onImageUpload, uploadFile, videoID , selectImageIndex}) =>{
 const uploadSelector = useRef<HTMLDivElement>(null);
 const thumbsContainerRef = useRef<HTMLDivElement>(null);
 const [imgIndex, setImageIndex] = useState(0);





 /*  used for Image src */
 const myLoader=({src}:any)=>{
  return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumbs/${src}`;
}


/* selects the clicked thumb and saves its index */
const onImageClick = (e:React.MouseEvent) =>{
  const img = e.target as HTMLImageElement;
  const allChildren = [...img?.parentElement!.parentElement!.children];
  // unselect process
  const selectedChildren = allChildren.filter((c) =>{ 
    const selector = c.children[1] as HTMLDivElement;
    if(selector.className.includes("imageSelector_active"))
    return c;
 })[0] as HTMLDivElement;
 let newClass = selectedChildren.className.split(" ")[0];
 selectedChildren.className = `${newClass}`
 const selectedClass = selectedChildren.children[1].className.split(" ")[0];
 selectedChildren.children[1].className = `${selectedClass}`

  // select process
  const selectorParent = img?.parentElement! as HTMLDivElement;
  const selector = selectorParent.children[1] as HTMLDivElement;

  const selecorParentClass = img?.parentElement!.className.split(" ")[0];
  selectorParent.className = `${selecorParentClass} ${styles.imageSelect}`

  const prevClass = selector.className;
  selector.className = `${prevClass} ${styles.imageSelector_active}`

  const selectedIndex = selectorParent.children[2].className;
  setImageIndex(+selectedIndex)
}

/* triggers hover effect by entering the mouse */
const onImageEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault();
  // Do something
  const targ = e.currentTarget as HTMLDivElement;
  targ.className = `${targ.className} ${styles.scaleImage}`
};
/* triggers hover effect by leaving with the mouse */
const onImageLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault();
  // Do something
  const targ = e.currentTarget as HTMLDivElement;
  const classes = targ.className.split(" ")
  const newClasses = classes.filter(c => !c.includes("scaleImage"))
  targ.className = `${newClasses.join(" ")}`
};


/* display thumb with some hover effect */
const imageLoader = (videoID:string, index:number) =>{
  return <div  key={index} onMouseEnter={onImageEnter} onMouseLeave={onImageLeave} onClick={onImageClick} className={`${styles.imageWrapper} ${index === 0 ? styles.imageSelect:""}`}> 
          <Image loader={myLoader} src={`${videoID}&${index}`} alt={`${videoID}&${index}`} height={800} width={800}
                       style={{borderRadius:10}}
          />
          <div className={`${styles.imageSelector} ${index === 0 ? styles.imageSelector_active : ""}`}></div>
          <div className={`${index}`}></div>
       </div>
}



/* saves index of thumb if by changes on ImgIndex */
 useLayoutEffect(() =>{
  selectImageIndex(imgIndex)
 },[imgIndex])


 /* handles the new uploaded file and selected its index */
  const onImage = (files: any, err: any) =>{
    const file = files[0];
    
    if(file){
      if(thumbsContainerRef && thumbsContainerRef.current){
      // unselect all other thumbs
        const children = [...thumbsContainerRef.current.children];
        children.forEach(c =>{
          const selector = c.children[1];
          c.className = `${c.classList[0]}`
          selector.className = selector.classList[0]
        })
      
        // select upload file imageSelector_active
        const selectorParent = children[4];
        const selector = selectorParent.children[1] as HTMLDivElement;
        selectorParent.className = `${selectorParent.classList[0]} ${styles.imageSelect}`
        selector.className = `${selector.classList[0]} ${styles.imageSelector_active}`
        selectImageIndex(-1)
      }
    }
    onImageUpload(files, err)
  }

  /*  variants for framer : used for animation reference https://framer.com */
  const variants = {
    hover: {
        scale:1.2     
    },
    tap:{
      scale:0.8   
    },
    inactive: {
      scale:1
    }
  }


  return (
    <div className={styles.thumbsWrapper}>
      
      <div ref={thumbsContainerRef} className={`${styles.thumbsContainer} ${styles.snapInline}`} >

        {
          [0,1].map(index =>{
            return imageLoader(videoID , index);
          })
        }   
         
         <div className={`${styles.imageWrapper}`} onMouseEnter={onImageEnter} onMouseLeave={onImageLeave}>              
         <ImageUploader onImageUpload={onImage}>
          {uploadFile ? 
          <Image
          src={uploadFile} alt="thumb" width={400} height={400}
          blurDataURL={ typeof uploadFile === "string" ? uploadFile : "" } style={{borderRadius:10, background:"white"}}
          />
          : ""
          }        
          </ImageUploader>
          <div ref={uploadSelector} className={`${styles.imageSelector}`} style={{pointerEvents:"none"}}></div>
          </div>
        </div>
    </div>
  )
}





export default ThumbGalleryPopup




