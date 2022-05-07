import styles from "../styles/videoplayer.module.scss";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import React, { useRef, useState } from "react";
import Slider from './Slider';
import { motion } from "framer-motion"

interface VideoPlayerProps {
    videoPath: string | string[] | undefined
    duration:{minute:number , second:number} 
}


  

const VideoPlayer = ({ videoPath , duration }:VideoPlayerProps) =>{
    const [isClicked , setIsclicked] = useState(false);
    const VideoControllerRef = useRef<HTMLDivElement>(null)!;
    const [maxWidth , setMaxWidth] = useState(0);
    const [volumeWidth , setVolumeWidth] = useState(0);

    const [shouldPlay , setShouldPlay] = useState(false);
    const [currentTime , setCurrentTime] = useState(0);
    const [modifiedduration , setModifiedDuration] = useState({minute:0 , second:0});
    const [modifiedCurrentTime , setModifiedCurrentTime] = useState({minute:0 , second:0});
    const [isVolumeOff , setIsVolumeOff] = useState(false);
    const [volumeValue ,setVolumeValue] = useState(50);
    const [videoRange , SetvideoRange] = useState(0);
    const [shouldFullScreen , setShouldFullScreen] = useState(false);
    const [shouldFade , setShouldFade] = useState(false);

    // useRef
    const videoPlayerRef = useRef<HTMLVideoElement>(null)!;
    const fade = useRef<HTMLDivElement>(null);

    useLayoutEffect(() =>{
        if(VideoControllerRef)
            setMaxWidth(VideoControllerRef.current!.clientWidth);
    }, [VideoControllerRef])

    useLayoutEffect(() =>{
        videoPlayerRef.current!.volume = (+volumeValue / 100);
    }, [videoPlayerRef, volumeValue])

    const onVideoControllHover = (e:React.MouseEvent<HTMLSelectElement>)=>{

    }
    const onvideoControllLeave = (e:React.MouseEvent<HTMLSelectElement>)=>{
        
    }
    const onControllClick = (e:React.MouseEvent<HTMLDivElement>) =>{
       
        const contoller = e.target as HTMLDivElement;

        if(contoller.id === "videoController"){
            setShouldPlay(!shouldPlay);
             shouldPlay === true ? videoPlayerRef.current!.pause() : videoPlayerRef.current!.play();
        }
        
    }

    const onVideoEnded = (e:React.MouseEvent<HTMLVideoElement>) =>{
        setShouldPlay(false);
    }

    const onVideoTimeUpdate =  (e:React.MouseEvent<HTMLVideoElement>) =>{
        const currentTime = videoPlayerRef.current!.currentTime;
        setCurrentTime(currentTime);
        const [minute , second ] = regularTime(currentTime)
        setModifiedCurrentTime( {minute:+minute , second:+second} )
      }

      const regularTime = (time:number )=>{
        const minute = parseInt((time / 60).toString() , 10).toLocaleString('en-US' , {minimumIntegerDigits:2 , useGrouping:false})
        const second = parseInt((time % 60).toString() , 10).toLocaleString('en-US' , {minimumIntegerDigits:2 , useGrouping:false})
        return [minute , second]
      }

    
    useLayoutEffect(() =>{
        const [minute , second ] = regularTime(0)
        setModifiedCurrentTime({minute:+minute , second:+second})
    },[])


    const onVolumeIconClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        setIsVolumeOff(!isVolumeOff);
    }
     
    const onVolumeChange = (e:React.ChangeEvent<HTMLInputElement> , newValue:string) =>{
        setVolumeValue(+newValue);
    }   

    const onVideoRangeChange =  (e:React.ChangeEvent<HTMLInputElement> , newValue:string) =>{
        if(VideoControllerRef){
            videoPlayerRef.current!.currentTime = (+newValue * +duration / 100);
            SetvideoRange(+newValue)
        }
   
    }   

    useLayoutEffect(() =>{
        
    }, [videoRange])

    useLayoutEffect(() =>{
            
            setMaxWidth(VideoControllerRef.current!.clientWidth);

    },[VideoControllerRef, shouldFullScreen])

    useLayoutEffect(() =>{
        
        const newPos = 100 * videoPlayerRef.current!.currentTime / +duration;
        if(!isNaN(newPos))
        SetvideoRange(newPos)
     }, [currentTime, duration, videoPlayerRef])

     const onFullScreen = (e:React.MouseEvent<HTMLDivElement>) =>{
        const fadeDiv = fade.current!;
 
        setShouldFullScreen(!shouldFullScreen);
        if(fadeDiv){
            setTimeout(() =>{
                fade.current!.classList.remove("fadeIn");
            } , 300)
        }
        
    } 

      useLayoutEffect(()=>{
        setTimeout(()=>{setShouldFade(false)}, 300)
        setShouldFade(true)

      }, [shouldFullScreen])


      const onVideoProgress = (e:React.MouseEvent<HTMLVideoElement>) =>{
            console.log(e)
      }
      const onVideoLoaded = (e:React.MouseEvent<HTMLVideoElement>) =>{
        //console.log(e)
      }

    return(

        <section className={`${styles.video_container_wrapper} 
                            `} onMouseLeave={onvideoControllLeave} onMouseEnter={onVideoControllHover}>
                        <div ref={fade} className={`${shouldFade? styles.fadeIn : styles.fadeOut }`}></div>                     
                        <motion.div
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                        >

                            <div className={`${styles.video_container} ${shouldFullScreen? styles.fullScreen : ""}`}  >
                            <video poster={`${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${videoPath}`}
                                    ref={videoPlayerRef}
                                    onEnded={onVideoEnded}
                                    onTimeUpdate={onVideoTimeUpdate} 
                                    onProgress={onVideoProgress}
                                    onLoadedData={onVideoLoaded}
                            >
                                    <source src={`${process.env.NEXT_PUBLIC_REMOTE}/watch/${videoPath}`} />
                            </video>
                            <div onClick={onControllClick} ref={VideoControllerRef}  className={styles.video_controller}>
                                    <div id={"videoController"} className={styles.video_controller_wrapper}>
                                        <div className={styles.video_bottom_controll}>
                                                <Slider onChange={onVideoRangeChange}   value={videoRange} height={5} />
                                                <div className={styles.video_bottom_controll_player}>
                                                    <div>   
                                                        {shouldPlay? "pause":"play"}
                                                    </div>
                                                    <motion.div 
                                                        whileHover={{width:100}}
                                                        animate={{width:0}}
                                                    >
                                                    <div
                                                        className={styles.volume_container}
                                                        
                                                        onClick={onVolumeIconClick}
                                                    >
                                                        <div /* onMouseEnter={onVolumeIconEnter} onMouseLeave={onVolumeIconLeave} */>
                                                        volume
                                                        </div>
                                                        <Slider onChange={onVolumeChange}  
                                                                value={volumeValue} 
                                                                fillColor={"white"} 
                                                                height={5} 
                                                        />

                                                    </div>
                                                    </motion.div>
                                                    <div className={styles.video_bottom_right_container}>
                                                        <div className={`${styles.video_full_btn_container}`} onClick={onFullScreen}>
                                                            {
                                                                shouldFullScreen? "small":"Full"
                                                            }                           
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>

                            </div>
                            </div>
                        </motion.div> 
                        

        </section>
    )

}

export default VideoPlayer
