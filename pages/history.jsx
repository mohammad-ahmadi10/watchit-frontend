import styles from "../styles/History.module.scss";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import UseVideoHistory from "../utils/useVideoHistory";
import {useState , useRef , useCallback  } from "react";
import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {BiCheckShield } from "react-icons/bi";
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../utils/functions";
import Link from 'next/link'
import Image from 'next/image';

const History = () => {

    const [pageNr, setPageNr] = useState(0);
    const observer = useRef(null);
    const {videos, hasMore, loading, error } = UseVideoHistory(pageNr)
    const lastVideosElementRef = useCallback(node => {
      if(loading) return;
      if(observer && observer.current){
           observer.current.disconnect()
      } 
      observer.current = new IntersectionObserver(entries =>{
              if(entries[0].isIntersecting){
                if(node !== null){
                  if(hasMore)
                  setPageNr(n => n+1)
                }
              }
      })
      if(node) observer.current.observe(node)    
    }, [loading, hasMore]);


    
const onBookmarkClicked = (_) =>{
        
}

const myLoader=({src})=>{
  return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
}

   /*  useLayoutEffect(() =>{
        (async () =>{
            const rs = await costumAxios.get("/video/myhistory")
            console.log(rs)
        })();
    }, []) */


    const displayImage = (file , ref) =>{
        const [minute, second] = regularTime(file.duration);
        
        return <div ref={ref ? ref : null}  key={file.id}  id={file.id} className={styles.gridChild} >
          <Link href={`watch/${file.id}`}>
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
          <motion.div 
            whileHover={{ scale: 1.2 }}
            className={styles.bookmarkContainer}
          >
               <UseAnimations animation={bookmark}  strokeColor={"white"} fillColor={"white"} onClick={onBookmarkClicked}/>
          </motion.div>
          </div>
         <div className={styles.videoInfoContainer}>
           <span>{file.title}</span>
           <div className={styles.usernameContainer}>
             <span>{file.username}</span>
             <BiCheckShield size={18} style={{color:"green"}}/>
           </div>
           <div className={styles.view_dateContainer}>
                <span>seen {modifyUplodedDate(new Date(file.seen))} </span>
           </div>
          </div>
        </a>
      </Link>
      </div>
      }



    return (
        <div className={styles.historyContainer}>
            <div className={styles.history_tag}><span>History</span></div>
           <div className={styles.gridWrapper}>
            {
              videos &&  videos.map((d, index) => {
                if(videos.length === index+1)
                return displayImage(d, lastVideosElementRef);
                return displayImage(d); 
              }) 
            }
            {
              <span>{loading && 'loading'}</span>
            }
            </div>


        </div>

    )
}

export default History;