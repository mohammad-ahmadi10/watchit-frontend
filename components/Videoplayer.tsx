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
import {TiArrowBack} from "react-icons/ti"
import Link from 'next/link'
import Image from 'next/image';

import { Popover , Progress , Menu } from 'antd';
import "antd/dist/antd.dark.css"
import { Spin } from 'antd';
import costumAxios from "../utils/axios";
import fileDownload from 'js-file-download';

import {useSelector, useDispatch} from "react-redux";
import {selectVideo} from "../src/store";
import { login , User } from '../src/features/userSlice';
import { selectUser } from '../src/store';
import {regularTime} from "../utils/functions";
import settings2 from 'react-useanimations/lib/settings2'
import arrowRightCircle from 'react-useanimations/lib/arrowRightCircle'
import UseAnimations from "react-useanimations";
import {VolumeState , DownloadStatus} from "../utils/enums";
import {CostumDocument , CostumHTMLDivElement} from "../utils/fullscreen"
import {useRouter} from 'next/router'

const displayIcon = (ICON:any , v?:number,  classN?:string) =>  { 
    if (typeof classN !== 'undefined')
        return <ICON  className={styles[classN]} style={{pointerEvents:"none"}}/>
    if(typeof v !== 'undefined')
       return  <ICON size={v} style={{pointerEvents:"none"}}/>
    return  <ICON style={{pointerEvents:"none"}}/>  
}






// player Props
interface VideoPlayerProps {
    videoPath: string | string[] | undefined
    duration:number
    title:string
    onTheatreRequest?: (value:boolean) => void
    resolutions?:[string]
}




const VideoPlayer = ({ videoPath , duration , title, onTheatreRequest , resolutions=[""] }:VideoPlayerProps) =>{
    const VideoControllerRef = useRef<HTMLDivElement>(null)!;
    const [downloadstatus,  setDownloadstatus] = useState(DownloadStatus.ONPAUSE);

    const [shouldPlay , setShouldPlay] = useState(false);
    const [currentTime , setCurrentTime] = useState(0);
    const [modifiedduration , setModifiedDuration] = useState({minute:0 , second:0});
    const [modifiedCurrentTime , setModifiedCurrentTime] = useState({minute:0 , second:0});

    const [volumeValue ,setVolumeValue] = useState(50);
    const [videoRange , SetvideoRange] = useState(0);
    const [shouldFullScreen , setShouldFullScreen] = useState(false);
    const [shouldFade , setShouldFade] = useState(false);
    const [volumeState , setVolumeState] = useState(VolumeState.NORMAL)
    const [isVolumeHover , setIsVolumeHover ] = useState(false);
    const [isTheater , setIsTheater] = useState(false);
    const [shouldThumbShowing, setShouldThumbShowing] = useState(true);
    const [downloadPopup , setDownloadPopup] = useState(false);
    const [settingPopup , setSettingPopup] = useState(false);
    const [downloadSelected, setDownloadSelected] = useState(" ");
    const [progressPercent , setProgressPercent] = useState(0);
    const [token , setToken] = useState("");
    const [seekingVal , setSeekingVal] = useState(0);
    const [shouldViewUp , setShouldViewUp] = useState(false);
    const [viewSuccess , setViewSuccess] = useState(false);


    // useRef
    const videoPlayerRef = useRef<HTMLVideoElement>(null)!;
    const videoPlayerContainerRef =  useRef<CostumHTMLDivElement>(null)!;
    const fade = useRef<HTMLDivElement>(null);
    const downloadListRef = useRef<HTMLUListElement>(null);
    const nextVideo = useSelector(selectVideo)
    
    const [isControllHover , setIsControllHover] = useState(false);

    const router = useRouter();

    useLayoutEffect(() =>{
        const actoken = localStorage.getItem("ACTKEN");
        if(actoken)
        setToken(actoken)
    })

    /* view up if use has skiped 3 times or shouldViewUp is true */
    useLayoutEffect(() =>{
        (
            async () =>{
                if(seekingVal === 3 || shouldViewUp ){
                    if(!viewSuccess){
                        const {data} = await costumAxios.put("/video/view", {id:videoPath})
                        setViewSuccess(true);
                    }
                }
            }
        )();
    }, [seekingVal , shouldViewUp ])

    const userState = useSelector(selectUser)
    const dispatch = useDispatch();
    
    
    const handleKeyDown = (event:React.MouseEvent) => {
        const t = event.target as HTMLElement;
        if(event){
            if(t.className.includes && !t.className.includes("event_lister")){
                setDownloadPopup(false);
/*                 setSettingPopup(false); */
            }
        }
    }
    
    
    useLayoutEffect(() => {
        window.addEventListener('click', handleKeyDown);    
        // cleanup this component
        return () => {
          window.removeEventListener('click', handleKeyDown);
        };
      }, []);

      useLayoutEffect(() =>{
        const v = localStorage.getItem("volume");
        if(v){
            setVolumeValue(v)
            checkVolume(v);
        }
      }, [])



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

        if(!isFullScreen(document)){

            if(videoPlayerContainerRef && videoPlayerContainerRef.current){
                if (videoPlayerContainerRef.current.requestFullScreen) videoPlayerContainerRef.current.requestFullScreen();
                else if (videoPlayerContainerRef.current.mozRequestFullScreen) videoPlayerContainerRef.current.mozRequestFullScreen();
                else if (videoPlayerContainerRef.current.webkitRequestFullScreen) videoPlayerContainerRef.current.webkitRequestFullScreen();
                else if (videoPlayerContainerRef.current.msRequestFullScreen) videoPlayerContainerRef.current.msRequestFullScreen();
                
                setFullscreenData(true);
                setShouldFullScreen(true);
            }
        }else{
             if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
            setFullscreenData(false);
            setShouldFullScreen(false);
        }
 }
 
 const isFullScreen = function(document:CostumDocument) {
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
          if(onTheatreRequest)
        onTheatreRequest(isTheater)
      }, [isTheater])


      
    useLayoutEffect(() =>{
            const t = localStorage.getItem("theater");
            const acctoken = localStorage.getItem("ACTKEN");
            const refreshtoken = localStorage.getItem("SSRFSH");
            if(t){
                const val = t === 'true'
                setIsTheater(val)
            }
            if(acctoken && refreshtoken){
               (
                  async () =>{
                    const rs = await costumAxios.get("/auth/me");
                    if(typeof res !== 'undefined') {
                        const {id, email , username} = rs.data.modifiedUser;
                        const newUser:User = {
                            id,
                            username,
                            email,
                            profileImage:"",
                            }
    
                        dispatch(login({
                            user: newUser,
                            logIn:true,
                            errorMSG:""
                        }))
                    }
                    

                   }
               )()
            }

    }, [])


    useLayoutEffect(() =>{
        const [minute , second ] = regularTime(duration)
        setModifiedDuration({minute:+minute , second:+second})
    }, [])
    useLayoutEffect(() =>{
        (async () =>{
            const rs = await costumAxios.put("/watch/addtoHistory", {videoID:videoPath})
            console.log(rs)
        })();
    }, [])


    useLayoutEffect(() =>{
        const [minute , second ] = regularTime(0)
        setModifiedCurrentTime({minute:+minute , second:+second})
    },[])


    const controll_variants = {
        open: { opacity: 1 },
        closed: { opacity: 0, transition:{ delay: 1 } },
    }
    
    useLayoutEffect(() =>{
        videoPlayerRef.current!.volume = (+volumeValue / 100);
    }, [videoPlayerRef, volumeValue])


    const onControllClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        console.log(e.target)
        if(e.target.className && e.target.className.includes  &&   e.target.className.includes("thumbPlay")){
            if(shouldThumbShowing){
                setShouldThumbShowing(false);
                setShouldPlay(true);
            }
        }else if(e.target.className && e.target.className.includes  &&   e.target.className.includes("video_controller_wrapper") ){
            setShouldPlay(p =>!p);
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

    

    const onVideoSeeking = (e:React.MouseEvent<HTMLVideoElement>) =>{
        setSeekingVal(v => v+1);
    }


    const onVideoTimeUpdate =  (e:React.MouseEvent<HTMLVideoElement>) =>{
        const currentTime = videoPlayerRef.current!.currentTime;
        setCurrentTime(currentTime);
        const [minute , second ] = regularTime(currentTime)
        setModifiedCurrentTime( {minute:+minute , second:+second} )

        const currentVideoProcent = Math.round(currentTime * 100 / duration);
        if(!shouldViewUp)
          setShouldViewUp( currentVideoProcent > 5)
      }
  


  

      const onSettingListitemClick = async (e:React.MouseEvent<HTMLElement>) =>{
         const l = e.target as HTMLListitem;
         const resu = l.innerHTML;

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
            setDownloadstatus(DownloadStatus.ONDOWNLOADING)
            setDownloadPopup(false);
            setSettingPopup(false);
            const rs =  await costumAxios.get(url, {responseType: 'blob',
            onDownloadProgress:(data)=>{
                const loadingData =  Math.round(data.loaded / data.total * 100);
                setProgressPercent(loadingData);
                if(loadingData === 100){
                    setDownloadstatus(DownloadStatus.DOWNLAODED)
                    setTimeout(() =>{
                        setProgressPercent(0);

                    }, 1000)
                } 
            }
            });

            const end = rs.headers["content-type"].split("/")[1]
            const filename = title + "_" + resu + "." + end;
            fileDownload(rs.data, filename)
            {
                setTimeout(() =>{
                    setDownloadstatus(DownloadStatus.ONPAUSE)

                }, 500)
            }
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
        if(volumeState !== VolumeState.MUTED){
            setVolumeState(VolumeState.MUTED)
            localStorage.setItem("volume" , volumeValue);
            setVolumeValue(0);
        }else{
            const v = localStorage.getItem("volume");
            checkVolume(v)
            setVolumeValue(v);
        }

    }
     
    const checkVolume = (v:number) =>{
        if (v <= 0)
        setVolumeState(VolumeState.MUTED)
        else if(v > 1 && v < 10)
        setVolumeState(VolumeState.UNMUTED)
        else if(v > 10 && v < 60){
            setVolumeState(VolumeState.NORMAL)
        }else if(v > 60) 
        setVolumeState(VolumeState.LOAD)
    }
    const onVolumeChange = (v:number) =>{
        checkVolume(v);
        setVolumeValue(v);
        localStorage.setItem("volume" , v);
    }   

    const onVideoRangeChange =  (newValue:number) =>{
        if(VideoControllerRef){
            videoPlayerRef.current!.currentTime = (newValue * +duration / 100);
            localStorage.setItem("rg", JSON.stringify({v:newValue, id:videoPath }));
            SetvideoRange(newValue)
        }
   
    }   

    useLayoutEffect(() =>{
        const rg = localStorage.getItem("rg");
        if(rg){
            const {v, id} = JSON.parse(rg);
            if(id === videoPath ) {
                SetvideoRange(v)
                videoPlayerRef.current!.currentTime = (v * +duration / 100);;
            }
        }
    }, [])

    useLayoutEffect(() =>{
        
        const newPos = 100 * videoPlayerRef.current!.currentTime / +duration;
        if(!isNaN(newPos)){
        
                SetvideoRange(newPos)
                localStorage.setItem("rg", JSON.stringify({v:newPos , id:videoPath}));
        }
     }, [currentTime, duration, videoPlayerRef])


     useLayoutEffect(()=>{
       if(videoPlayerRef && videoPlayerRef.current)
       shouldPlay === true ? videoPlayerRef.current!.play() : videoPlayerRef.current!.pause();
     }, [shouldPlay])
    
      const onPlayClick = (e:React.MouseEvent<HTMLDivElement>)=>{
            setShouldPlay(!shouldPlay);
            setShouldThumbShowing(false);
            
      }

      const onVideoProgress = (e:React.MouseEvent<HTMLVideoElement>) =>{
            //console.log(e)
      }
      const onVideoLoaded = (e:React.MouseEvent<HTMLVideoElement>) =>{
        //console.log(e)
      }
     const onSpeedClick = (e:React.MouseEvent<HTMLSpanElement>) =>{
        const el = e.target as HTMLSpanElement;
        const s = el.innerHTML.toLowerCase() === "standard" ? "1" : el.innerHTML;
        
        if(videoPlayerRef && videoPlayerRef.current)
        videoPlayerRef.current.playbackRate = parseFloat(s);

        setDownloadPopup(false);
        setSettingPopup(false);
     }
     const onQualityClick = (e:React.MouseEvent<HTMLSpanElement>) =>{
        const el = e.target as HTMLSpanElement;
        if(videoPlayerRef && videoPlayerRef.current){

            videoPlayerRef.current.pause()
            const sr = videoPlayerRef.current.children[0];
            const oldSRC = sr.src;
            const newSRC = `${process.env.NEXT_PUBLIC_REMOTE}/watch/${videoPath}/${el.innerHTML}`;
            sr.src = newSRC;
            videoPlayerRef.current.load();
            videoPlayerRef.current.play();
        }
        
        setDownloadPopup(false);
        setSettingPopup(false);
     }


      const getSpeedList = () =>{
          const speeds = ["0.25" , "0.5" , "0.75", "1" , "1.25" , "1.5" , "1.75" , "2"]
          const arr = speeds.map((s,ind) =>{
              return {
                  key:`1-${ind}`,
                  label: (<span onClick={onSpeedClick} style={{display:"block"}}>
                              {s === "1" ? "Standard" : s}
                          </span>)
              }
          })
          return arr
      }
      const getQualityChildren = ()=>{
        const arr = typeof resolutions !== 'undefined' && resolutions.map((r, ind) =>{
                 return {
                    key: `2-${ind}`,
                    label: (<span onClick={onQualityClick} style={{display:"block"}}>
                        {r}
                    </span>),
                  }
               })
        return arr

      }

      const myLoader=({src}:any)=>{
        return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
      }
      
      


    const onInput = (e: React.KeyboardEvent<FormControl>) =>{
        const document : CostumDocument = window.document;
        if(e.key === "Escape"){
        } 
    }


    const onBackClick = (e:React.MouseEvent<HTMLDivElement>) =>{
          router.back();
    }


    return(

        <section className={styles.video_container_wrapper} onKeyPress={onInput} tabIndex={0}
        >

                        <div ref={fade} className={`${shouldFade? styles.fadeIn : styles.fadeOut }`}></div>  
                        <motion.div
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            className={`${styles.video_container} ${shouldFullScreen? styles.fullScreen : ""}`}
                        >

                            
                          <div ref={videoPlayerContainerRef} onKeyDown={onInput} tabIndex={1}>

                        { !isTheater &&<div className={`${shouldThumbShowing ? styles.thumbBackground : styles.onStyle}`}>
                        <Image loader={myLoader} priority={true} layout={"fill"}  src={`${videoPath}`} alt={videoPath ? videoPath!.toString() : "thumb"}
                         />


                        </div>}
                            <video 
                                    ref={videoPlayerRef}
                                    onEnded={onVideoEnded}
                                    onTimeUpdate={onVideoTimeUpdate} 
                                    onProgress={onVideoProgress}
                                    onLoadedData={onVideoLoaded}
                                    onKeyDown={onInput}
                                    onSeeking={onVideoSeeking}
                                    >
                                    {
                                        resolutions.length === 0 ?
                                        <source src={`${process.env.NEXT_PUBLIC_REMOTE}/watch/${videoPath}`} />
                                        :
                                        <source src={`${process.env.NEXT_PUBLIC_REMOTE}/watch/${videoPath}/${resolutions[resolutions.length -1]}`} />

                                    }
                                    {/* <p>Your browser cannot play the provided video file.</p> */}
                            </video>
                               

                            <motion.div 
                             variants={volumeVariants}
                             initial="hidden"
                             animate={isVolumeHover ? "show" : "hidden"}
                            >
                            <div onClick={onControllClick} ref={VideoControllerRef}  className={styles.video_controller} >
                                {/* <motion.div 
                                   initial={"closed"}
                                   animate={isControllHover ? "open" : "closed"}
                                   variants={controll_variants}
                                   onMouseEnter={() => setIsControllHover(true)}
                                   onMouseLeave={() => setIsControllHover(false)}
                                   animate={isHover ? "open":"closed"}
                                   id={"videoController"} 
                                    */}
                                   <div className={`${isTheater ? styles.video_controller_wrapper_theater_mode : styles.video_controller_wrapper}`} >
                                   
                                   <div className={`${shouldThumbShowing ?  styles.thumbPlayBt_Wrapper : styles.onStyle}`}>
                                    <motion.div 
                                       className={styles.thumbPlayButton}
                                       whileHover={{ scale: 1.1 }}
                                       whileTap={{ scale: 0.9 }}
                                     >
                                         {displayIcon( BsPlay , 100 )}
                                     </motion.div>
                                   </div>

                                   { !shouldThumbShowing &&
                                        <div className={styles.top_layer}>
                                           <div className={` ${styles.leftside} ${isTheater ? styles.toplayer_theater_mode : ""}`}>
                                               <span>{title}</span>
                                           </div>
                                          <div className={` ${styles.rightside} ${isTheater ? styles.toplayer_theater_mode : ""}`}>
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
                                                     {   !shouldFullScreen ? 
                                                         <div className={styles.volume_icon}>
                                                                 <UseAnimations animation={arrowRightCircle} size={40} strokeColor={"white"} fillColor={"white"} speed={8}  />
                                                         </div >
                                                         : ""
                                                     }
                                                 </Popover>
                                            }
                                          </div>
                                        </div> 
                                        } 
                                        { !shouldThumbShowing &&
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
                                                    <div className={styles.bottom__left}>

                                                    <div className={styles.center} onClick={onBackClick}>
                                                       {displayIcon( TiArrowBack)}
                                                    </div>
                                                    <div className={styles.center} onClick={onPlayClick}> 
                                                   
                                                                {
                                                                   
                                                                   shouldPlay ?  displayIcon( BsPauseFill)
                                                                   :
                                                                                 displayIcon( BsPlayFill)                
                                                                }  
                                                    </div>
                                                    <div onMouseEnter={onImageEnter} onMouseLeave={onImageLeave}>
                                                    <div
                                                        className={styles.volume_container}
                                                        
                                                        >
                                                        <motion.div 
                                                            className={styles.volume_icon}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={onVolumeIconClick}
                                                            >
                                                        {
                                                            volumeState === VolumeState.NORMAL &&  displayIcon( BsFillVolumeDownFill ) 
                                                        }
                                                        {
                                                            volumeState === VolumeState.MUTED && displayIcon( BsFillVolumeMuteFill )
                                                        }
                                                        {
                                                            volumeState === VolumeState.UNMUTED && displayIcon( BsFillVolumeOffFill ) 
                                                        }
                                                        {
                                                            volumeState === VolumeState.LOAD &&  displayIcon( BsFillVolumeUpFill ) 
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
                                                                       token === null || token.length <= 0 ?   
                                                                       <div className={styles.notLogin_container}>
                                                                         <span>you aren't logged in</span>  
                                                                         <Link href={`/login`}>
                                                                            <a href="#">
                                                                              Login
                                                                            </a>
                                                                          </Link>
                                                                         <Spin/>
                                                                        </div>
                                                                       :

                                                                            <ul ref={downloadListRef}>
                                                                                {resolutions.map(r => <li key={r} onClick={onDowloadListitemClick} >{r}</li>)}
                                                                                <li onClick={onDowloadListitemClick}>MP3</li>
                                                                            </ul> 
                                                                   }

                                                              </div>
                                                           </div> 
                                                           : ""
                                                           }
                                                         
                                                         
                                                         <div className={`${styles.download_icon_container}`} onClick={onDownload} >
                                                             

                                                            { <motion.div 
                                                                   className={`${downloadstatus !== DownloadStatus.ONPAUSE ? styles.noOpacity : styles.event_lister}`}
                                                                   whileHover={{ scale: 1.1 }}
                                                                   whileTap={{ scale: 0.9 }}
                                                            >
                                                               {displayIcon( BiDownload  )}
                                                               
                                                            </motion.div>} 
                                                         </div>


                                                    </div>

                                                       
                                                        <div className={`${styles.video_theater_container}`} >

                                                        {
                                                               settingPopup && !downloadPopup ? 
                                                                <div className={styles.downloadOps}>
                                                             
                                                              <div className={styles.pointer}></div>

                                                              <div className={styles.downloadList_container}>

                                                                  {/* menu start */}
                                                                  <Menu 
                                                                  triggerSubMenuAction={"click"}
                                                                  style={{overflow:"auto"}}
                                                                  items={[
                                                                    {
                                                                      key: '1',
                                                                      label: 'playback speed',
                                                                      children: getSpeedList(),
                                                                    },
                                                                    {
                                                                      key: '2',
                                                                      label: 'Quality',
                                                                      children: getQualityChildren()
                                                                    },

                                                                    ]}
                                                                  />

                                                                  {/* menu end */}
                                                              </div>
                                                           </div> 
                                                           : ""
                                                           }
                                                       


                                                        <motion.div 
                                                            onClick={onSettingClick} 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className={styles.event_lister}
                                                            >

                                                       {/* {
                                                           displayIcon( GoSettings   )   
                                                       } */}
                                                       
                                                       <UseAnimations animation={settings2} size={40} strokeColor={"white"} fillColor={"white"}
                                                        />
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
                                                            isTheater ?  displayIcon( MdCropSquare   )    :  displayIcon( BiRectangle   ) 
                                                        } 
                                                         </motion.div> 
                                                          
                                                         : ""
                                                        }
                                                        
                                                        
                                                        {/* at the moment Fullscreen is not supported  */}
                                                        {/* <motion.div   className={`${styles.video_full_btn_container}`} 
                                                               whileHover={{ scale: 1.1 }}
                                                               transition={{duration:0.6}}
                                                               onClick={() => handleFullscreen()}
                                                            >
                                                            {
                                                                shouldFullScreen ?  displayIcon( BsFullscreenExit  ) :  displayIcon( BsFullscreen ) 
                                                            }                     
                                                            </motion.div> */}
                                                       
                                                    </div>
                                                     
                                                    }
                                                           {downloadstatus !== DownloadStatus.ONPAUSE && <div className={styles.progressBar}>
                                                              <Progress percent={progressPercent} status="active"   type="line"
                                                                        strokeColor={{
                                                                        '0%': '#108ee9',
                                                                        '100%': '#87d068',
                                                                        }}        
                                                            trailColor={"white"}
                                                            strokeLinecap={"round"} 
                                                            showInfo={downloadstatus !== DownloadStatus.ONPAUSE}
                                                            strokeWidth={3}
                                                            style={{pointerEvents:"none"}}     
                                                            />
                                                            </div>}
                                                </div>
                                        </div>
                                        }
                                </div>
                            </div>
                            </motion.div>
                    </div>
                    </motion.div> 
                        
        </section>
    )

}

export default VideoPlayer
