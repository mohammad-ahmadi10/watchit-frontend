import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import clientAxios from "../../utils/axios";
import {VideoPrevData} from "../../types/page"
import styles from "../../styles/search.module.scss"
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../../utils/functions";
import Link from 'next/link'
import Image from 'next/image';
import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {BiCheckShield } from "react-icons/bi";

import { GetServerSideProps } from 'next'

interface SearchProps{
    videos:[VideoPrevData]
}


export const myLoader=({src}:any)=>{
  return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
}


const onBookmarkClicked = (_:any) =>{
        
}


const  Search =({videos}:SearchProps) => {
  const router = useRouter()
  

  const displayImage = (file:VideoPrevData) =>{
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
               videos && videos.length > 0 &&  
               videos.map(v => displayImage(v))
             }
            

        </div>
    </div>
  )
}


export const getServerSideProps:GetServerSideProps = async (c) =>{
    const routes = c.query.search
    const url = (routes.split("=")[1]).replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
    const {data} = await clientAxios.get(`${process.env.NEXT_PUBLIC_REMOTE}/watch/search_query/${url}`)
    
    if(data.length <= 0){
      return {
        notFound:true
      }
    }

    return {
      props:{
        videos:data
      }}
}






export default Search