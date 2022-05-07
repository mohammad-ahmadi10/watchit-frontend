import React, { useMemo } from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import styles from "../styles/login.module.scss";
import Link from 'next/link'

import clientAxios from "../utils/axios";

import { useDispatch, useSelector } from 'react-redux';
import { login , User } from '../src/features/userSlice';
import { selectUser } from '../src/store';


function Register() {
    const userState = useSelector(selectUser)



    const [password , setPassword] = useState("");
    const [emailusername ,setEmailUsername] = useState("");   
    const [errMSG , setErrMSG] = useState("");
    const [success , setSuccess] = useState(false);



    const emailuserRef = useRef<HTMLInputElement>(null)!;
    const errRef = useRef<HTMLParagraphElement>(null)!;
    

    const dispatch = useDispatch();

    const memorizedUSER_REGES = useMemo(() =>{
        return  /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

    }, [])

    const memorizedPSS_REGES = useMemo(() =>{
        return  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    }, [])

    const memorizedEMAIL_REGES = useMemo(() =>{
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    }, [])


    useLayoutEffect(() =>{
        emailuserRef.current!.focus();
        setPassword("")
        setEmailUsername("")


    }, [])

    useLayoutEffect(() =>{
        if(userState.errorMSG){
            if(userState.errorMSG.length > 0 ){
                setErrMSG(userState.errorMSG.toString());
                errRef.current!.focus();
            }
        }    
        

    }, [userState.errorMSG])

    useLayoutEffect(() =>{
      setErrMSG("")
    }, [password , emailusername])

    const onLoginSubmit = async (e:React.MouseEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const isEmail = memorizedEMAIL_REGES.test(emailusername);
        /* "/auth/login" */
        const response = await clientAxios.post("auth/login" , 
        {emailusername, password , isEmail});
        console.log(response)
        if(response){
            
        
        const {id, username, email} = response.data!.user; 
        setPassword(id);
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

        setPassword("")
        setEmailUsername("") 
        }else{
            errRef.current!.focus();
            setErrMSG("no Response");
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

    const onLogout = async (e:React.MouseEvent<HTMLParagraphElement>) =>{
        const response = await clientAxios.get("auth/logout");
        console.log(response.data)
    }
    return (
        <>
            <p onClick={onLogout}>LOGOUT</p>
        {
            success?
            (<section>
                <h1>You are logged in!</h1>
                <p>
                   <Link href={"/"}><a href='#'>Go to Home page</a></Link>
                </p>
            </section>)
            
                :
                   ( <section className={styles.section_container}>
                        

                        <p  ref={errRef}
                            className={`${errMSG ? styles.errmsg : styles.offscreen} `}
                            aria-live="assertive"
                        >
                            {errMSG}

                        </p>
                        {/* start */}
                            <div className="form_wrapper">
                                <div className="form_container">
                                        
                                        <h2>Login</h2>
                                        <form onSubmit={onLoginSubmit} 
                                                className={styles.form_container}
                                                
                                            >
                                                   


                                                    <div className={styles.email_usersname_container}>
                                                            <label htmlFor="email_uesrname">
                                                                Email:
                                                            </label>

                                                            <input 
                                                                type="text" 
                                                                name="email_username" 
                                                                id="email_username"
                                                                ref={emailuserRef}
                                                                placeholder="Username or Email" 
                                                                autoComplete="off"
                                                                onChange={onEmailUsernameChange}
                                                                value={emailusername}
                                                                required
                                                            />
                                                    </div>

                                                    <div className={styles.pass_container}> 
                                                        
                                                            <label htmlFor="password">
                                                                password:
                                                            </label>

                                                            <input 
                                                                type="password" 
                                                                name="password" 
                                                                id="password"
                                                                placeholder="password" 
                                                                onChange={onPassChange}
                                                                value={password}
                                                                required
                                                            />
                                                    </div>
                                            <input defaultValue={"Login"}
                                                   type="submit"
                                                   disabled={ emailusername.length <= 0 || password.length <= 0 ? true : false}
                                                   className={styles.button} 
                                            
                                            />
                                            
                                             <p>
                                                <span className={styles.line }> 
                                                    <Link href={"/forgot-password"}><a href='#'>forgot password?</a></Link>
                                                </span>
                                            </p>
                                            </form>
                                        <p>
                                            Need an account?<br/>
                                            <span
                                                className={styles.line }
                                                
                                            > 
                                                <Link href={"/register"}><a href='#'>Sign up</a></Link>
                                            </span>
                                        </p>
                                </div>
                            </div>
                        {/* End */}
                    </section>)

            }                                                  
    </>
  )
}

export default Register