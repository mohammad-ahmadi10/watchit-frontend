import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import costumAxios from "../../utils/axios";
import {UserData} from "../../types/page"
import styles from "../../styles/search.module.scss"
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../../utils/functions";
import Link from 'next/link'
import Image from 'next/image';
import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import {BiCheckShield } from "react-icons/bi";

import { GetServerSideProps } from 'next'
import useLayoutEffect from "../../utils/IsOrmorphicLayoutEffect";
import { Row, Col } from 'antd';
import "antd/dist/antd.dark.css"


interface UserProps{
    username:string
}





const  User =({username}:UserProps) => {
  const router = useRouter()
  const [user, setUser] = useState<UserData>(null)
  useLayoutEffect(() =>{

    (async () =>{
        try{
            const {data} = await costumAxios.get(`/auth/me`)
            setUser(data.modifiedUser)
        }
        catch(e){
            setUser(null)
        }
    })()
   
  }, [username])

    
  return (
    <div className={styles.user_container}>
           <Row>
          <Col span={18} push={6}>
            col-18 col-push-6
          </Col>
          <Col span={6} pull={18}>
            col-6 col-pull-18
          </Col>
        </Row>
    </div>
   
  )
}


export const getServerSideProps:GetServerSideProps = async (c) =>{
    const user = c.query.username
    /* const url = (routes.split("=")[1]).replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '') */
    
    if(user){
        return {
           props:{
            username:user
           } 
        }        
    }else {
        props:{
            username:undefined
           } 
    }
}






export default User