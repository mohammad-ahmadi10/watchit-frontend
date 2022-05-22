import styles from "../styles/videoplayer.module.scss";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import React, { useRef, useState } from "react";
import Slider from './CostumSlider';
import { motion } from "framer-motion"
import { BsFillVolumeUpFill , BsFillVolumeDownFill, BsFillVolumeMuteFill , BsFillVolumeOffFill , BsPlayFill, BsPauseFill,
         BsFullscreen, BsFullscreenExit , BsPlay
       } from 'react-icons/bs';
import { BiRectangle , BiDownload  } from "react-icons/bi";
import {MdCropSquare} from "react-icons/md";
import {GoSettings} from "react-icons/go"

import {useSelector} from "react-redux";
import {selectVideo} from "../src/store";
import Link from 'next/link'
import Image from 'next/image';

import { Popover , Progress } from 'antd';
import "antd/dist/antd.dark.css"
import { Spin } from 'antd';
import {GrFormNextLink} from "react-icons/gr";
import costumAxios from "../utils/axios";
import fileDownload from 'js-file-download';


// fullscreen Interfaces
interface CostumDocument extends Document{
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    webkitCancelFullScreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    webkitCancelFullScreenElement?: Element;

  }
  interface CostumHTMLDivElement extends HTMLDivElement {
    msRequestFullScreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullScreen?: () => Promise<void>;
  }



 






  // player Props
interface VideoPlayerProps {
    videoPath: string | string[] | undefined
    duration:number
    title:string
    onTheatreRequest: (value:boolean) => {}
    resolutions:[string]
}


// volume enumState
enum VolumeState{
    NORMAL,MUTED,UNMUTED,LOAD
}



const VideoPlayer = ({ videoPath , duration , title, onTheatreRequest , resolutions }:VideoPlayerProps) =>{
    const VideoControllerRef = useRef<HTMLDivElement>(null)!;
 
    const [shouldPlay , setShouldPlay] = useState(false);
    const [currentTime , setCurrentTime] = useState(0);
    const [modifiedduration , setModifiedDuration] = useState({minute:0 , second:0});
    const [modifiedCurrentTime , setModifiedCurrentTime] = useState({minute:0 , second:0});
    const [isVolumeOff , setIsVolumeOff] = useState(false);
    const [volumeValue ,setVolumeValue] = useState(50);
    const [videoRange , SetvideoRange] = useState(0);
    const [shouldFullScreen , setShouldFullScreen] = useState(false);
    const [shouldFade , setShouldFade] = useState(false);
    const [volumeState , setVolumeState] = useState(VolumeState.NORMAL)
    const [isVolumeHover , setIsVolumeHover ] = useState(false);
    const [isTheater, setIsTheater] = useState(false);
    const [iconSize , setIconSize] = useState(35);
    const [shouldThumbShowing, setShouldThumbShowing] = useState(true);
    const [downloadPopup , setDownloadPopup] = useState(false);
    const [settingPopup , setSettingPopup] = useState(false);
    const [downloadSelected, setDownloadSelected] = useState(" ");
    const [progressPercent , setProgressPercent] = useState(0);
    
    // useRef
    const videoPlayerRef = useRef<HTMLVideoElement>(null)!;
    const videoPlayerContainerRef =  useRef<CostumHTMLDivElement>(null)!;
    const fade = useRef<HTMLDivElement>(null);
    const downloadListRef = useRef<HTMLElement>(null);
    const nextVideo = useSelector(selectVideo)
    




    // show & hide for volume
    const volumeVariants = {
        hidden: {   
            width:0,
            transition: {
              duration:0.5,
              delay:1
            }
          },
        show: {
          width:100,
          transition: {
            duration:0.5
          }
        }
      }


      
      
      //// fullscreen 
const handleFullscreen = function() {
    const document : CostumDocument = window.document;

    try{
    if (isFullScreen()) {
       if (document.mozCancelFullScreen) document.mozCancelFullScreen();
       else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
       else if (document.msExitFullscreen) document.msExitFullscreen();
       setFullscreenData(false);
       setShouldFullScreen(false);
    }
    else {
        if(videoPlayerContainerRef && videoPlayerContainerRef.current){
              if (videoPlayerContainerRef.current.mozRequestFullScreen) videoPlayerContainerRef.current.mozRequestFullScreen();
              else if (videoPlayerContainerRef.current.webkitRequestFullScreen) videoPlayerContainerRef.current.webkitRequestFullScreen();
              else if (videoPlayerContainerRef.current.msRequestFullScreen) videoPlayerContainerRef.current.msRequestFullScreen();
              setFullscreenData(true);
              setShouldFullScreen(true);
        }
    }

    }catch(er){
        console.log(er)
    }
 }
 
 const isFullScreen = function() {
    const document : CostumDocument = window.document;

    return !!( document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement);
 }
 const setFullscreenData = function(state:boolean) {
    if(videoPlayerContainerRef && videoPlayerContainerRef.current)
    videoPlayerContainerRef.current.setAttribute('data-fullscreen', (!!state).toString());
 }
//// fullscreen end



      const onImageEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
       setIsVolumeHover(true)
      };
      const onImageLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsVolumeHover(false)
       
      };

      useLayoutEffect(() =>{
        onTheatreRequest(isTheater)
      }, [isTheater])


      
    useLayoutEffect(() =>{
            const t = localStorage.getItem("theater");
            if(t){
                const val = t === 'true'
                setIsTheater(val)
            }
    }, [])


    useLayoutEffect(() =>{
        let [minute , second ] = regularTime(duration)
        setModifiedDuration({minute:+minute , second:+second})
    }, [])
    useLayoutEffect(() =>{
        let [minute , second ] = regularTime(0)
        setModifiedCurrentTime({minute:+minute , second:+second})
    },[])




    useLayoutEffect(() =>{
        videoPlayerRef.current!.volume = (+volumeValue / 100);
    }, [videoPlayerRef, volumeValue])


    const onControllClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        if(e.target.className &&  e.target.className.includes("thumbPlay")){
            if(shouldThumbShowing){
                setShouldThumbShowing(false);
                setShouldPlay(true);
            }
        }
        


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

    const onDowloadListitemClick = async (e:React.MouseEvent<HTMLElement>) =>{
        const l = e.target as HTMLListitem;
        const resu = l.innerHTML;
        if(resu !== ""){
            let url = "";
            if(resu === "MP3") 
            url = `/watch/download/mp3/${videoPath}`
            else 
            url = `/watch/download/${videoPath}&${resu}`
             
            const rs =  await costumAxios.get(url, {responseType: 'blob'}, 
            {onUploadProgress:(data)=>{
                const loadingData =  Math.round(data.loaded / data.total * 100);
                setProgressPercent(loadingData);
                if(loadingData === 100){
                  /* setUploadStatus(UploadStatus.UPLOADED); */
                } 
            }}
            );

            const end = rs.headers["content-type"].split("/")[1]
            const filename = title + "_" + resu + "." + end;
            fileDownload(rs.data, filename)
        }

        setDownloadSelected(l.innerHTML)
    }


    

    const onTheaterClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        setIsTheater(!isTheater);
        localStorage.setItem("theater", (!isTheater).toString());
    }
    const onSettingClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        setSettingPopup(!settingPopup);
        setDownloadPopup(false);
        
    }
    const onDownload = (e:React.MouseEvent<HTMLDivElement>) =>{
        setDownloadPopup(!downloadPopup);
        setSettingPopup(false)
    }

    
    const onVolumeIconClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        setIsVolumeOff(!isVolumeOff);
    }
     
    const onVolumeChange = (v:number) =>{
        if (v <= 0)
        setVolumeState(VolumeState.MUTED)
        else if(v > 1 && v < 10)
        setVolumeState(VolumeState.UNMUTED)
        else if(v > 10 && v < 60){
            setVolumeState(VolumeState.NORMAL)
        }else if(v > 60) 
        setVolumeState(VolumeState.LOAD)
        
        setVolumeValue(v);
    }   

    const onVideoRangeChange =  (newValue:number) =>{
        if(VideoControllerRef){
            videoPlayerRef.current!.currentTime = (newValue * +duration / 100);
            SetvideoRange(newValue)
        }
   
    }   

    useLayoutEffect(() =>{
        
        const newPos = 100 * videoPlayerRef.current!.currentTime / +duration;
        if(!isNaN(newPos))
        SetvideoRange(newPos)
     }, [currentTime, duration, videoPlayerRef])


     useLayoutEffect(()=>{
       if(videoPlayerRef && videoPlayerRef.current)
       shouldPlay === true ? videoPlayerRef.current!.play() : videoPlayerRef.current!.pause();
     }, [shouldPlay])
    
     

      const onVideoProgress = (e:React.MouseEvent<HTMLVideoElement>) =>{
            //console.log(e)
      }
      const onVideoLoaded = (e:React.MouseEvent<HTMLVideoElement>) =>{
        //console.log(e)
      }


      const myLoader=({src}:any)=>{
        return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
      }
      type SvgInHtml = HTMLElement & SVGElement;
      const displayIcon = (ICON:SvgInHtml, v:number, classN?:string) =>  {
          
        if (typeof classN !== 'undefined') {
            return <ICON size={v} className={styles[classN]} style={{pointerEvents:"none"}}/>
        }

       return  <ICON size={v} style={{pointerEvents:"none"}}/>
    }


    const onInput = (e: React.KeyboardEvent<FormControl>) =>{
        const document : CostumDocument = window.document;
        if(e.key === "Escape"){

            if(window.fullscreen){
                if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                setFullscreenData(false);
                setShouldFullScreen(false);

            }
        }
        
    }



    return(

        <section className={`${styles.video_container_wrapper}`} onKeyPress={onInput} tabIndex={0}
                 
        >
                        <div ref={fade} className={`${shouldFade? styles.fadeIn : styles.fadeOut }`}></div>  

                                                            

                        <motion.div
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            className={`${styles.video_container} ${shouldFullScreen? styles.fullScreen : ""}`}
                        >

                            
                        <div className={`${shouldThumbShowing ? styles.thumbBackground : styles.onStyle}`}>
                        <Image loader={myLoader} layout={"fill"}  src={`${videoPath}`} alt={videoPath.toString()}
                         />


                        </div>
                          <div ref={videoPlayerContainerRef} onKeyDown={onInput} tabIndex={1}>

                            <video 
                                    ref={videoPlayerRef}
                                    onEnded={onVideoEnded}
                                    onTimeUpdate={onVideoTimeUpdate} 
                                    onProgress={onVideoProgress}
                                    onLoadedData={onVideoLoaded}
                                    onKeyDown={onInput}
                                    >
                                    <source src={`${process.env.NEXT_PUBLIC_REMOTE}/watch/${videoPath}`} />
                            </video>
                               

                            <motion.div 
                                                        variants={volumeVariants}
                                                        initial="hidden"
                                                        animate={isVolumeHover ? "show" : "hidden"}
                                                        >
                            <div onClick={onControllClick} ref={VideoControllerRef}  className={styles.video_controller}>
                                <div id={"videoController"} className={styles.video_controller_wrapper}>

                            <div className={`${shouldThumbShowing ?  styles.thumbPlayBt_Wrapper : styles.onStyle}`}>
                               <motion.div 
                                  className={styles.thumbPlayButton}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  >
                                  {displayIcon( BsPlay , 100 )}
                                </motion.div >
                            </div>


                                        <div className={styles.top_layer}>
                                         <div className={styles.leftside}>
                                               <span>{title}</span>
                                         </div>

                                        
                                         <div className={styles.rightside}>
                                             {
                                                 nextVideo.id !== 0 && 
                                                 

                                                 <Popover placement="rightTop" content={
                                                     <Link href={`${nextVideo.id}`}>
                                                    <a href="#">
                                                        <div>

                                                      <Image loader={myLoader} height={80} width={100}
                                                           src={`${nextVideo.id}`} alt={nextVideo.id.toString()}
                                                           />
                                                    <span>{nextVideo.title}</span>
                                                    </div>
                                                    </a>
                                                   </Link>
                                                 } title="Next video"  trigger="click" >
                                                     {
                                                         !shouldFullScreen ? 
                                                         <motion.div 
                                                         className={styles.volume_icon}
                                                             whileHover={{ scale: 1.1 }}
                                                             whileTap={{ scale: 0.9 }}
                                                             >
                                                                 {displayIcon( GrFormNextLink , iconSize, "nextVideoIcon"  )}
                                                           </motion.div >
                                                     : ""
                                                    }
                                                     
                                                 </Popover>

                                             }
                                            
                                         </div>
                                        </div>
                                        <div className={`${!shouldFullScreen ?   styles.video_bottom_controll: styles.video_bottom_controll_fullscreen}`}>
                                                 
                                                 <div className={styles.time}>
                                                     

                                                     <div className={styles.currentTime_container}>
                                                     <span>
                                                     {modifiedCurrentTime.minute < 10 ? "0"+modifiedCurrentTime.minute : modifiedCurrentTime.minute}
                                                     
                                                     </span>
                                                     : 
                                                     <span>
                                                     {modifiedCurrentTime.second < 10 ? "0" + modifiedCurrentTime.second : modifiedCurrentTime.second} 
                                                     </span>
                                                     </div>

                                                    /
                                                     <div className={styles.duration_container}>
                                                     <span>
                                                     {modifiedduration.minute < 10 ? "0" + modifiedduration.minute : modifiedduration.minute }
                                                     </span>
                                                     : 
                                                     <span>
                                                     {modifiedduration.second < 10 ? "0" + modifiedduration.second : modifiedduration.second } 
                                                     </span>
                                                     </div>
                                                      
                                                          
                                                     </div>        
                                                
                                                <Slider onChange={onVideoRangeChange}   value={videoRange} height={5} />
                                                <div className={styles.video_bottom_controll_player}>
                                                    <div> 
                                                   
                                                                {
                                                                   
                                                                   shouldPlay ?  displayIcon( BsPauseFill , iconSize  )
                                                                   :
                                                                                 displayIcon( BsPlayFill , iconSize  )                
                                                                }  
                                                    </div>
                                                    <div onMouseEnter={onImageEnter} onMouseLeave={onImageLeave}>
                                                    
                                                   
                                                    <div
                                                        className={styles.volume_container}
                                                        onClick={onVolumeIconClick}
                                                    >
                                                        <motion.div 
                                                            className={styles.volume_icon}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            >
                                                        {
                                                            volumeState === VolumeState.NORMAL &&  displayIcon( BsFillVolumeDownFill , iconSize) 
                                                        }
                                                        {
                                                             volumeState === VolumeState.MUTED && displayIcon( BsFillVolumeMuteFill , iconSize)
                                                        }
                                                        {
                                                             volumeState === VolumeState.UNMUTED && displayIcon( BsFillVolumeOffFill , iconSize) 
                                                        }
                                                        {
                                                            volumeState === VolumeState.LOAD &&  displayIcon( BsFillVolumeUpFill , iconSize) 
                                                        }
                                                        </motion.div>
                                                        <motion.div 
                                                        variants={volumeVariants}
                                                        initial="hidden"
                                                        animate={isVolumeHover ? "show" : "hidden"}
                                                        >
                                                          <Slider onChange={onVolumeChange}  
                                                                value={volumeValue} 
                                                                fillColor={"white"} 
                                                                height={5} 
                                                           />
                                                        </motion.div>
                                                    </div>
                                                    
                                                    

                                                    
                                                    </div>
                                                    {
                                                    
                                                    <div className={styles.video_bottom_right_container}>


                                                         
                                                        <div className={`${styles.video_theater_container}`} >

                                                           {
                                                               downloadPopup && !settingPopup ?
                                                               <div className={styles.downloadOps}>
                                                             
                                                              <div className={styles.pointer}></div>

                                                              <div className={styles.downloadList_container}>
                                                                  
                                                                   {
                                                                       downloadSelected === "" ?   <Spin/>
                                                                       :

                                                                            <ul ref={downloadListRef}>
                                                                                {resolutions.map(r => <li key={r} onClick={onDowloadListitemClick}>{r}</li>)}
                                                                                <li onClick={onDowloadListitemClick}>MP3</li>
                                                                            </ul> 
                                                                   }

                                                              </div>
                                                           </div> 
                                                           : ""
                                                           }
                                                       
                                                         <motion.div 
                                                         onClick={onDownload} 
                                                         whileHover={{ scale: 1.1 }}
                                                         whileTap={{ scale: 0.9 }}
                                                         >
                                                          {displayIcon( BiDownload , iconSize )}
                                                         </motion.div> 
                                                        </div>

                                                       
                                                        <div className={`${styles.video_theater_container}`} >

                                                        {
                                                               settingPopup && !downloadPopup ? 
                                                                <div className={styles.downloadOps}>
                                                             
                                                              <div className={styles.pointer}></div>

                                                              <div className={styles.downloadList_container}>
                                                                 <ul>
                                                                    
                                                                    <li>playback speed</li>
                                                                    <li>Quality</li>

                                                                 </ul> 

                                                              </div>
                                                           </div> 
                                                           : ""
                                                           }
                                                       


                                                        <motion.div 
                                                            onClick={onSettingClick} 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            >

                                                       {
                                                           displayIcon( GoSettings , iconSize  )   
                                                       }

                                                       </motion.div> 
                                                        
                                                        </div>
                                                        


                                                        {
                                                            !shouldFullScreen ? 
                                                            <motion.div 
                                                            className={`${styles.video_theater_container}`} 
                                                            onClick={onTheaterClick} 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            >
                                                        {
                                                            isTheater ?  displayIcon( MdCropSquare , iconSize  )    :  displayIcon( BiRectangle , iconSize  ) 
                                                        } 
                                                         </motion.div> 
                                                          
                                                         : ""
                                                        }
                                                        


                                                        <motion.div   className={`${styles.video_full_btn_container}`} 
                                                               whileHover={{ scale: 1.1 }}
                                                               transition={{duration:0.6}}
                                                               onClick={() => handleFullscreen()}

                                                        >

                                                            {
                                                                shouldFullScreen ?  displayIcon( BsFullscreenExit , iconSize- 5  ) :  displayIcon( BsFullscreen , iconSize- 5  ) 
                                                            }
                                                            
                                                            
                                                                
                                                                                
                                                        </motion.div>
                                                    </div>
                                                     
                                                    }
                                                </div>
                                        </div>
                                    </div>
                            </div>


                            <div className={styles.progressBar}>
                  <Progress percent={progressPercent} status="active" 
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}        
                            trailColor={"white"}
                            strokeLinecap={"square"} 
                            type={"line"}
                            size={"small"}        
                  />
              </div>



                            </motion.div>
                    </div>
                    </motion.div> 
                        
        </section>
    )

}

export default VideoPlayer
