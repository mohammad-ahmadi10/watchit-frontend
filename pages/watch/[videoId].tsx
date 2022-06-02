import  {useRouter} from "next/router";
import { NextPageContext } from "next";
import Videoplayer from "../../components/Videoplayer";
import styles from "../../styles/videoPage.module.scss";
import clientAxios from "../../utils/axios";
import axios from 'axios';
import useLayoutEffect from "../../utils/IsOrmorphicLayoutEffect";
import Link from "next/link";
import {useRef , useState  } from "react";
import { useDispatch } from 'react-redux';
import { setNextVideo } from '../../src/features/VideoSlice';
import Image from 'next/image';
import {regularTime} from "../../utils/functions";
import {BiCheckShield } from "react-icons/bi";
import {BsBookmarkStar , BsBookmarkStarFill} from "react-icons/bs";

import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {VideoPrevData} from "../../types/page";
import {modifyUplodedDate , modifyAmountOfView} from "../../utils/functions";


interface Video{
    id:string,
    title:string,
    folder:string,
    duration:number,
    timestamp:number,
    views:number,
    comments:[string],
    likes:number,
    resolutions:[string],
    username:string,
    date:Date,
    userID:string
}
interface videoProps{
  currentVideo:Video
  videos:[Video]
}


const  Video = (props:videoProps) => {
  const [theaterMode , setTheaterMode] = useState(false);
  const [isbooked , setIsbooked] = useState(false);
  const [videos, setVideos] = useState<VideoPrevData>(props.videos);

  const router = useRouter();
  const videoId:string = router.query.videoId!.toString();
  const metadata = props.currentVideo;
  
  const standardRef = useRef<HTMLDivElement>(null);
  const otherVideosContainerRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch();
  
  const onTheaterClick = (value:boolean) =>{
    setTheaterMode(value)
  }
  
  const setVideoPlayer = (metadata:Video, videoId:string) =>{
    return <>
                <Videoplayer duration={metadata.duration}  
                             videoPath={videoId} 
                             title={metadata.title}
                             resolutions={metadata.resolutions}
                             onTheatreRequest={onTheaterClick}
                />   
    </>
  }
  
  const onBookmarkClicked = (_:any) =>{ 
  }

    const myLoader=({src}:any)=>{
      return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
    }
    
    /* 
     displays every video thumb which is got back from API
     @file: Video 
            is an object von type Video 
    */
    const displayImage = (file:Video) =>{
      let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(+file.date)
      const [minute, second] = regularTime(file.duration);
       return <Link href={`${file.id}`} key={file.id}  id={file.id} className={styles.otherVideoContainer}>
                <a href="#" className={styles.thumbContainer}>
                  <div className={styles.img_wrapper}>
                     <Image loader={myLoader} height={160} width={200}
                          src={`${file.id}`} alt={file.id} layout="fixed"
                      />
                      <div className={styles.duration_container}>
                       <span>{minute}</span>
                       :
                       <span>{second}</span>
                    </div>
                  </div>
   
                    
                  <motion.div 
                    whileHover={{ scale: 1.3 }}
                    className={styles.bookmarkContainer}
                  >
                       <UseAnimations animation={bookmark}  strokeColor={"white"} fillColor={"white"} onClick={onBookmarkClicked}/>
                  </motion.div>
                
                 <div className={styles.videoInfoContainer}>
                   <span>{file.title}</span>
                   <div className={styles.usernameContainer}>
                     <span>{file.username}</span>
                     <BiCheckShield size={18} style={{color:"green"}}/>
                   </div>
                   <div className={styles.view_dateContainer}>
                        <span>{modifyAmountOfView(/* +file.view */ 20)}</span>
                        <span>{modifyUplodedDate(new Date(file.date))} </span>
                   </div>
                  </div>
                </a>
              </Link>
    }    

    useLayoutEffect(()=>{
       if(videos.length > 0 )
       dispatch(setNextVideo({
         id:videos[0].id,
         title:videos[0].title,
         duration:videos[0].duration
       }))

    }, [videos])



  return (
    <div className={styles.video_container}>     
      
      {Object.keys(props).length === 0 ?
        <>
        <p>this video is probably deleted </p> 
         <Link href={`/`}> 
          <button>Go to Home Page</button>
         </Link>
        </>
         :
         <>
         
         <div className={`${theaterMode ? styles.videoplayer__theater_wrapper : styles.videoplayer_wrapper }`}>
              <div ref={standardRef} className={`${!theaterMode && styles.standard_wrapper}`}>
                <div className={styles.innerVideoWrapper}>
                 {setVideoPlayer(metadata, videoId)}
                </div>

              </div>      
              <div ref={otherVideosContainerRef} className={styles.other_videos_container}>
                  <div className={styles.wrapper}>
                  {
                    videos &&  videos.map((d:VideoPrevData) => {
                      if(d.id !== videoId)  
                      return displayImage(d);
                    }) 
                  }
                  </div>
                  
              </div>
               
         </div>
            
         </>
    }
  </div>
  )
}
        

Video.getInitialProps = async (ctx:NextPageContext) =>{
  const {videoId} = ctx.query;

  try {
  const res = await clientAxios.get(`watch/metadata/${videoId}`);
  const result = res.data;
  const {data} = await clientAxios.get("/");
  return{currentVideo:result , videos:data}
    
  } catch (error) {
    if(axios.isAxiosError(error)){
      return {};
    }
  }
}


export default Video;