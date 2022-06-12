import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import Image from 'next/image';
import {useDispatch, useSelector} from "react-redux";
import { selectUser } from '../src/store';
import { SpinnerDotted } from 'spinners-react';
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import costumAxios from "../utils/axios";
import Router from 'next/router'
import { login, logout } from '../src/features/userSlice';
import axios from "axios";
import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {BiCheckShield } from "react-icons/bi";
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../utils/functions";
import {useState , useRef , useCallback} from "react";
import UseVideoSearch from "../utils/useVideoSearch";


/* interface HomeProps{
  videos:[VideoPrevData]
} */

const onBookmarkClicked = (_) =>{
        
}

export const myLoader=({src})=>{
  return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
}

/* 
 displays every video thumb which is got back from API
 @file: VideoPrewData 
        is an object von type VideoPrewData 
*/
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
          <span>{modifyAmountOfView(+file.view)}</span>
          <span>{modifyUplodedDate(new Date(file.date))} </span>
     </div>
    </div>
  </a>
</Link>
</div>
}

/*
 calling the api and getting videos back
*/


const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser).user
  const message = useSelector(selectUser).errorMSG;
  
  const [query , setQuery] = useState("");
  const [pageNr, setPageNr] = useState(0);
  const observer = useRef(null);
  const {videos, hasMore, loading, error } = UseVideoSearch("", pageNr)
  const lastVideosElementRef = useCallback(node => {
    if(loading) return;
    if(observer && observer.current) observer.current.disconnect()
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

  /* useLayoutEffect(() =>{
      if(message.includes("Invalid refresh")){
        Router.push("/login")
        dispatch(logout())
        }
  }) */

  
  return (
    <div className={styles.container}>
      <Head>
        <title>watchit</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="viewport" content="width=device-width" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>


        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
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
    </div>
  )
}

/* Home.getInitialProps  = async () =>{
  try {
  const {data} = await costumAxios.get("/watch/");
  console.log(data)
  return{PreVideos:data}
    
  } catch (error) {
    if(axios.isAxiosError(error)){
      return {};
    }
  }
} */





export default Home
