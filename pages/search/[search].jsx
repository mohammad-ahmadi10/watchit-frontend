import React, { useState,useRef , useCallback } from 'react'
import { useRouter } from 'next/router'
import styles from "../../styles/search.module.scss"
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../../utils/functions";
import Link from 'next/link'
import Image from 'next/image';
import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {BiCheckShield } from "react-icons/bi";
import UseVideoSearch from "../../utils/useVideoSearch";
import useLayoutEffect from "../../utils/IsOrmorphicLayoutEffect";
import notFound from "../../public/not_found.png";

export const myLoader=({src})=>{
  return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
}


const onBookmarkClicked = (_) =>{
        
}


const  Search =() => {
  const router = useRouter()
  const {search} = router.query;
  const [query , setQuery] = useState(""); // set query and remove any smiley
  const [pageNr, setPageNr] = useState(0);
  const observer = useRef(null);

  useLayoutEffect(()=>{
    if(typeof search !== 'undefined')
    if(typeof router.query.search === "string")
     setQuery(router.query.search.split("=")[1].replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ''))
  }, [search])

  const {videos, hasMore, loading, error } = UseVideoSearch(query, pageNr)
  const lastVideosElementRef = useCallback(node => {
    if(loading) return;
    if(observer && observer.current) observer.current.disconnect()
     // Error: Cannot assign to 'current' because it is a read-only property.ts(2540)
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

  const displayImage = (file) =>{
    const [minute, second] = regularTime(file.duration);
    
    return <Link href={`/watch/${file.id}`} key={file.id}  id={file.id} className={styles.gridChild}>
    <a href="#" className={styles.seaarchthumbContainer}>
      <div className={styles.search_img_wrapper}>
         <Image loader={myLoader} 
              src={`${file.id}`} alt={file.id} layout="fill"
          />
          <div className={styles.duration_container}>
           <span>{minute}</span>
           :
           <span>{second}</span>
        </div>
       <motion.div 
        whileHover={{ scale: 1.1 }}
        className={styles.bookmarkContainer}
      >
           <UseAnimations animation={bookmark}  strokeColor={"white"} fillColor={"white"} onClick={onBookmarkClicked}/>
      </motion.div>
      </div>
      <div className={styles.videoInfoContainer}>
        <span>{file.title}</span>
        <div className={styles.view_dateContainer}>
          {/* +file.view */}
            <span>{modifyAmountOfView( 20)}</span>
            <span>{modifyUplodedDate(new Date(file.date))} </span>
        </div> 
         <div className={styles.usernameContainer}>
         <span>{file.username}</span>
         <BiCheckShield size={18} style={{color:"green"}}/>
        </div>
        <div className={styles.descrip}>{file.description}</div>
      </div>
      
    </a>
  </Link>
  }
    
  return (
    <div className={styles.search_container}>
        <div className={styles.search_wrapper}>
             {
               videos && videos.length > 0 ?  
               videos.map(v => displayImage(v))
               : 
               <div className={styles.noVideo}>
                 <span>
                 <Image src={notFound} alt={"not-found"} width={500} height={400}
                  />
                 </span>
                <span>Video is not found!</span>
                <span>double check your search and try it again</span>
               </div>
             }
            

        </div>
    </div>
  )
}


export default Search