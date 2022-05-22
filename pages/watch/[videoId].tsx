import Router, {useRouter} from "next/router";
import { NextPageContext } from "next";
import Videoplayer from "../../components/Videoplayer";
import styles from "../../styles/videoPage.module.scss";
import clientAxios from "../../utils/axios";
import axios from 'axios';
import useLayoutEffect from "../../utils/IsOrmorphicLayoutEffect";
import Link from "next/link";
import {useRef , useState} from "react";
import costumAxios from "../../utils/axios";
import useSWR from "swr";
import { useDispatch, useSelector } from 'react-redux';
import { setNextVideo } from '../../src/features/VideoSlice';
import Image from 'next/image';
import {VideoPrewData }  from "../index";



interface videoProps{
  data:{
    id:string,
    title:string,
    folder:string,
    duration:number,
    timestamp:number,
    views:number,
    comments:[string],
    likes:number
  }
}



const  Video = (props:videoProps) => {
  const [theaterMode , setTheaterMode] = useState(false);
  
  const router = useRouter();
  const videoId:string = router.query.videoId!.toString();
  const metadata = props.data;
  
  const standardRef = useRef<HTMLDivElement>(null);
  const theaterRef = useRef<HTMLDivElement>(null);
  const otherVideosContainerRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch();
  
  const onTheaterClick = (value:boolean) =>{
    setTheaterMode(value)
  }

  const setVideoPlayer = (metadata:videoProps["data"], videoId:string) =>{
    return <>
                <Videoplayer duration={metadata.duration}  
                             videoPath={videoId} 
                             title={metadata.title}
                             resolutions={metadata.resolutions}
                             onTheatreRequest={onTheaterClick}
                             />   
    </>
  }
  
    
    const myLoader=({src}:any)=>{
      return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
    }
    
    /* 
     displays every video thumb which is got back from API
     @file: VideoPrewData 
            is an object von type VideoPrewData 
    */
    const displayImage = (file:VideoPrewData) =>{
      let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(+file.date)
       return <div key={file.id}  id={file.id}>
                 <Link href={`${file.id}`}>
                   <a href="#">
                     <Image loader={myLoader} height={200} width={200}
                          src={`${file.id}`} alt={file.id}
                      />
                   </a>
                 </Link>
                 <span>{file.title}</span>
                   <span>{date}</span>
                   <span>{file.duration.minute}:{file.duration.second}</span>
               </div>
    }

    
    
    
    
    
    
    const fetcher = async() => {
      const res =  await costumAxios.get("/");
      return res.data
    }
    
    /*
    calling the api and getting videos back
    */
   const getVideos = () =>{
     const {data , error} =  useSWR('/' , fetcher)

       return {
        videos:data,
        isLoading: !error && !data,
        isError:error
       }
    }
    

    const {videos,isLoading,isError} = getVideos()

    useLayoutEffect(()=>{
       if(typeof videos !== 'undefined')
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
                 {setVideoPlayer(metadata, videoId)}
              </div>      
              <div ref={otherVideosContainerRef} className={styles.other_videos_container}>
                  {
                    videos &&  videos.map((d:VideoPrewData) => {
                      if(d.id !== videoId)  
                      return displayImage(d);
                    }) 
                  }
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
  return{data:result}
    
  } catch (error) {
    if(axios.isAxiosError(error)){
      return {};
    }
  }
}


export default Video;