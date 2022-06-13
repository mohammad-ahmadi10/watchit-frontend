import React, { useMemo } from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import styles from "../styles/login.module.scss";
import Link from 'next/link'
import arrowDown from 'react-useanimations/lib/arrowDown'
import UseAnimations from 'react-useanimations';
import {AiOutlineHome} from "react-icons/ai";
import clientAxios from "../utils/axios";

import { useDispatch, useSelector } from 'react-redux';
import { login , User } from '../src/features/userSlice';
import { selectUser } from '../src/store';
import {useRouter} from 'next/router'
import {forceReload} from "../utils/functions";
import { Button ,  Input, Form} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {InputRef} from "antd";

const Login = () => {
    const userState = useSelector(selectUser)
    const [password , setPassword] = useState("");
    const [emailusername ,setEmailUsername] = useState("");   
    const [errMSG , setErrMSG] = useState("");
    const [success , setSuccess] = useState(false);
    const [isLogging , setIslogging] = useState(false);

    const emailuserRef = useRef<InputRef>(null)!;
    const errRef = useRef<HTMLParagraphElement>(null)!;
    
    
    const dispatch = useDispatch();
    const selector = useSelector(selectUser)
    const router = useRouter();
   

    const memorizedUSER_REGES = useMemo(() =>{
        return  /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
        
    }, [])
    
    const memorizedPSS_REGES = useMemo(() =>{
        return  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
        
    }, [])
    
    const onLogout = async (e:React.MouseEvent<HTMLParagraphElement>) =>{
        const response = await clientAxios.get("auth/logout");
        if(response.status === 200){
          localStorage.setItem("ACTKEN", "")
          localStorage.setItem("SSRFSH", "")
          localStorage.setItem("user" , "")
          forceReload(router)
        }
      }
    const memorizedEMAIL_REGES = useMemo(() =>{
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    }, [])


    useLayoutEffect(() =>{
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("ACTKEN");
        
        if(userData){
            const {user} = JSON.parse(userData).payload;
            if(user) setSuccess(true);
        }/* else if( userData === null || userData.length <= 0) {
            if(token && userData === null)setTimeout(()=>{ forceReload(router)}, 3000)
        } */
    },[])

    useLayoutEffect(() =>{
        if(emailuserRef && emailuserRef.current){
            emailuserRef.current!.focus();
            setPassword("")
            setEmailUsername("")
        }
    }, [])


    useLayoutEffect(() =>{
        if(errRef && errRef.current){
            if(userState.errorMSG){
                if(userState.errorMSG.length > 0 ){
                    
                    setErrMSG(userState.errorMSG.toString());
                    errRef.current!.focus();
                }
            } 
        }
    }, [userState.errorMSG])

    useLayoutEffect(() =>{
      setErrMSG("")
    }, [password , emailusername])


    const onFinish = (values: any) => {
        console.log('Success:', values);
      };


    const onLoginSubmit = async (e:React.MouseEvent<HTMLFormElement>) =>{
        setIslogging(true);
        e.preventDefault();
        
        const isEmail = memorizedEMAIL_REGES.test(emailusername);
        /* "/auth/login" */
        const response = await clientAxios.post("auth/login" , 
        {emailusername, password , isEmail});
        if(response && response.data){
        const tokens = response.data.tokens;
        localStorage.setItem("ACTKEN", tokens.ACTKEN)
        localStorage.setItem("SSRFSH", tokens.SSRFSH)
        const {id, username, email, avatar} = response.data!.user; 
        setPassword(id);
        const newUser:User = {
        id,
        username,
        email,
        profileImage:avatar,
        }

        const ms = dispatch(login({
            user: newUser,
            logIn:true,
            errorMSG:""
        }))
        localStorage.setItem("user", JSON.stringify(ms));
        setPassword("")
        setEmailUsername("") 
        setIslogging(false);
        setTimeout(() =>{
            forceReload(router)
        }, 1000)
        }else{
            setIslogging(false);
            errRef.current!.focus();
            const {mssg} = selector.errorMSG;

            setErrMSG(mssg);
        }
    }

   


    const onPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const inputElement = e.target as HTMLInputElement;
        setPassword(inputElement.value)
    }


    const onEmailUsernameChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const inputElement = e.target as HTMLInputElement;
        setEmailUsername(inputElement.value)
    }


    return (
        <>
          
        {
            success?
            (   <div className={styles.loggedInContainer}>
                    <h1>You are already logged in!</h1>
                    <div className={styles.back}>
                       <UseAnimations animation={arrowDown}
                                      strokeColor={"white"} 
                                      fillColor={"white"}
                                      size={100}
                        />
                       <Link href={"/"}>
                         <a href={"#"}>  
                                <span>Go to Home page</span>
                        </a>
                       </Link>
                       <Link href={"/"}>
                         <a href={"#"}>  
                                <span onClick={onLogout}>Logout</span>
                        </a>
                       </Link>

                    </div>
                </div>
            )
            
                :
                   ( 
                   <section className={styles.loginWrapper}>
                   <div className={styles.section_container}>
                        <p  ref={errRef}
                            className={`${errMSG ? styles.errmsg : styles.offscreen} `}
                            aria-live="assertive"
                        >
                            {errMSG}
                        </p>
                        {/* start */}
                            <div className={styles.form_wrapper}>
                                <div className={styles.form_container}>    
                                        <h2>Login</h2>
                                        <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
<Form.Item
        name="email_uesrname"
        rules={[{ required: true, message: 'Please input your username!' }]}
        wrapperCol={{ offset: 0 , span: 24 }}
      >
         <Input 
                                                              name="email_username" 
                                                              id="email_username"
                                                              ref={emailuserRef}
                                                              placeholder="Username or Email" 
                                                              autoComplete="off"
                                                              onChange={onEmailUsernameChange}
                                                              value={emailusername}
                                                              required
                                                              style={{borderRadius:"0px", height:"70px"}}

                                                            />

      </Form.Item>
        

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        wrapperCol={{ offset: 0 , span: 24 }}
      >
         <Input.Password
                                                                name="password" 
                                                                id="password"
                                                                placeholder="password" 
                                                                onChange={onPassChange}
                                                                value={password}
                                                                required
                                                                style={{borderRadius:"0px", height:"70px"}}
                                                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                            />
                                            <span
                                                className={styles.line}                                                
                                            > 
                                                <Link href={"/forgot-password"}><a href='#'>Forgot password?</a></Link>
                                            </span>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
      <Button type="primary" htmlType="submit" ghost disabled={ emailusername.length <= 0 || password.length <= 0 ? true : false}
                                                            className={styles.button}  onClick={onLoginSubmit }  loading={isLogging}>
                                                           
                                                       Login
                                                     </Button>
      </Form.Item>

        </Form>
                                            
                                        <p>
                                            Need an account?<br/>
                                            <span
                                                className={styles.line}                                                
                                            > 
                                                <Link href={"/register"}><a href='#'>Sign up</a></Link>
                                            </span>
                                        </p>
                                </div>
                            </div>
                        {/* End */}
                    </div>
                    <div className={styles.box}>
                    <div className={`${styles.wave} ${styles._one}`}></div>
                    <div className={`${styles.wave} ${styles._two}`}></div>
                    <div className={`${styles.wave} ${styles._three}`}></div>
                    </div>
                    </section>
                    )

            }                                                  
    </>
  )
}

export default Login