import React, { useMemo } from 'react'
import { useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';

import { useRef } from 'react';
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import styles from "../styles/register.module.scss";
import Link from 'next/link'
import costumAxios from "../utils/axios";
import { selectUser } from '../src/store';
import { register} from "../src/features/userSlice";

function Register() {
    const userState = useSelector(selectUser)
    const dispatch = useDispatch();

    const [username , setUsername] = useState("");
    const [validusername, setValidusername] = useState(false);
    const [usernameFocus , setUsernameFocus] = useState(false);


    const [password , setPassword] = useState("");
    const [validPass, setValidPass] = useState(false);
    const [passFocus , setPassFocus] = useState(false);
    
    
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validConfirmPass, setValidConfirmPass] = useState(false);
    const [confirmPassFocus , setConfirmPassFocus] = useState(false);
    
    const [email ,setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus , setEmailFocus] = useState(false);
    

    const [errMSG , setErrMSG] = useState("");
    const [success , setSuccess] = useState(false);

    const [agreement , setAgreement] = useState(false);


    const userRef = useRef<HTMLInputElement>(null)!;
    const errRef = useRef<HTMLParagraphElement>(null)!;
    
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
        userRef.current!.focus();
    }, [])
    


    useLayoutEffect(() =>{
        
        const result = memorizedUSER_REGES.test(username);
        setValidusername(result);
    }, [memorizedUSER_REGES, username])

    useLayoutEffect(() =>{
        const result = memorizedEMAIL_REGES.test(email);
        setValidEmail(result);
    }, [memorizedEMAIL_REGES, email])


    useLayoutEffect(() =>{
            const result = memorizedPSS_REGES.test(password);
            setValidPass(result);

            const match = password === confirmPassword;
            setValidConfirmPass(match);
            
        }, [memorizedPSS_REGES, password , confirmPassword])

        useLayoutEffect(() =>{
           setUsername("")
           setPassword("")
           setEmail("")
           setConfirmPassword("")
            
        }, [])


    useLayoutEffect(() =>{
      setErrMSG("")
    }, [confirmPassword, username, password])


    useLayoutEffect(() =>{
        if(userState.errorMSG){
            if(userState.errorMSG.length > 0 ){
                setErrMSG(userState.errorMSG.toString());
                errRef.current!.focus();
            }
        }    
    }, [userState.errorMSG])


    const onRegisterSubmit = async (e:React.MouseEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const v1 = memorizedUSER_REGES.test(username);
        const v2 = memorizedPSS_REGES.test(password);
        const v3 = memorizedEMAIL_REGES.test(email);

        if(!v1 || !v2 || !v3){
            setErrMSG("Invalid Entry!")
            return
        }

        const response = await costumAxios.post("/auth/register" , 
        JSON.stringify({username, password, email}), 
        {
            headers:{'Content-Type':'application/json'},
            
        });

        if(response){
            const {data} = response; 
            setSuccess(true);
    
            setUsername("")
            setPassword("")
            setEmail("")
            setConfirmPassword("")
            dispatch(register({
                user: null,
                logIn:false,
                errorMSG:""
            }))
        }
       


    }
    const onUsernameChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const inputElement = e.target as HTMLInputElement;
        setUsername(inputElement.value)
    }

    const onPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const inputElement = e.target as HTMLInputElement;
        setPassword(inputElement.value)
    }
    const onConfirmPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const inputElement = e.target as HTMLInputElement;
        setConfirmPassword(inputElement.value)
    }

    const onEmailChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const inputElement = e.target as HTMLInputElement;
        setEmail(inputElement.value)
    }

    const onAgreementChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
          setAgreement(!agreement);
    }

    return (
        <>

        {
            success?
            (<section>
                <h1>Success!</h1>
                <p>
                   <Link href={"/login"}><a href='#'>Sign in</a></Link>
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
                                        
                                        <h2>Registration</h2>
                                        <form onSubmit={onRegisterSubmit} 
                                                className={styles.form_container}
                                                
                                            >
                                                    <div className={styles.username_container}>
                                                            <label htmlFor="username">
                                                                username:
                                                                <span className={`${validusername ? styles.valid : styles.hide}`}>
                                                                    GREEN CHECK
                                                                </span>
                                                                <span className={`${validusername || !username ? styles.hide : styles.invalid}`}>
                                                                    RED X
                                                                </span>
                                                            </label>

                                                            <input 
                                                                type="text" 
                                                                name="username" 
                                                                id="username"
                                                                placeholder="Username" 
                                                                ref={userRef}
                                                                autoComplete={"off"}
                                                                onChange={onUsernameChange}
                                                                required
                                                                aria-invalid={validusername ? "false" : "true"}
                                                                aria-describedby={"uidnote"}
                                                                onFocus={()=> setUsernameFocus(true)}
                                                                onBlur={()=> setUsernameFocus(false)}
                                                            />

                                                            <p id="uidnote"
                                                            className={`${usernameFocus && username && !validusername ?
                                                                            styles.instructions : styles.offscreen}`}
                                                            >
                                                                4 to 24 characters.<br/>
                                                                Must begin with a letter.<br/>
                                                                Letters, numbers, underscores, hyphens allowed.
                                                                
                                                            </p>
                                                    </div>


                                                    <div className={styles.email_container}>
                                                    <label htmlFor="email">
                                                                Email:
                                                                <span className={`${validEmail ? styles.valid : styles.hide}`}>
                                                                    GREEN CHECK
                                                                </span>
                                                                <span className={`${validEmail || !email ? styles.hide : styles.invalid}`}>
                                                                    RED X
                                                                </span>
                                                            </label>

                                                            <input 
                                                                type="text" 
                                                                name="email" 
                                                                id="email"
                                                                placeholder="username@email.com" 
                                                                autoComplete={"false"}
                                                                autoCorrect={"false"}
                                                                onChange={onEmailChange}
                                                                required
                                                                aria-invalid={validEmail ? "false" : "true"}
                                                                aria-describedby={"emailnote"}
                                                                onFocus={()=> setEmailFocus(true)}
                                                                onBlur={()=> setEmailFocus(false)}
                                                            />

                                                            <p id="emailnote"
                                                            className={`${emailFocus && email && !validEmail ?
                                                                styles.instructions : styles.offscreen}`}>
                                                            
                                                            Email Must have<br/>          <span aria-label="at symbol">@</span><br/>
                                                                                            <span aria-label="dot symbol">.</span>
                                                                                        
                                                                                                    
                                                            </p>


                                                    </div>

                                                    <div className={styles.pass_container}> 
                                                        
                                                            <label htmlFor="password">
                                                                password:
                                                               
                                                                <span className={`${validPass ? styles.valid : styles.hide}`}>
                                                                    GREEN CHECK
                                                                </span>
                                                                <span className={`${validPass || !password ? styles.hide : styles.invalid}`}>
                                                                    RED X
                                                                </span>
                                                            </label>

                                                            <input 
                                                                type="password" 
                                                                name="password" 
                                                                id="password"
                                                                placeholder="password" 
                                                                onChange={onPassChange}
                                                                required
                                                                aria-invalid={validPass ? "false" : "true"}
                                                                aria-describedby={"pwddnote"}
                                                                onFocus={()=> setPassFocus(true)}
                                                                onBlur={()=> setPassFocus(false)}
                                                            />

                                                            <p id="pwddnote"
                                                            className={`${passFocus && !validusername ?
                                                                            styles.instructions : styles.offscreen}`}
                                                            >
                                                                8 to 24 characters.<br/>
                                                                Must include uppercase and lowercase letters, number and a special character.<br/>
                                                                Allowed special characters: <span aria-label="exclamation mark">!</span>
                                                                                            <span aria-label="at symbol">@</span>
                                                                                            <span aria-label="hashtag">#</span>
                                                                                            <span aria-label="dollar sign">$</span>
                                                                                            <span aria-label="percent">%</span>
                                                                
                                                            </p>
                                                    </div>


                                                    <div className={styles.confirmpass_container}>
                                                    
                                                    <label htmlFor="password">
                                                                Confirm Password:
                                                                <span className={`${validConfirmPass && confirmPassword ? styles.valid : styles.hide}`}>
                                                                    GREEN CHECK
                                                                </span>
                                                                <span className={`${validConfirmPass || !confirmPassword ? styles.hide : styles.invalid}`}>
                                                                    RED X
                                                                </span>
                                                            </label>

                                                            <input 
                                                                type="password" 
                                                                name="confirm_password" 
                                                                id="confirm_password"
                                                                placeholder="confirm_password" 
                                                                onChange={onConfirmPassChange}
                                                                required
                                                                aria-invalid={validPass ? "false" : "true"}
                                                                aria-describedby={"confpwddnote"}
                                                                onFocus={()=> setConfirmPassFocus(true)}
                                                                onBlur={()=> setConfirmPassFocus(false)}
                                                            />

                                                            <p id="confpwddnote"
                                                            className={`${confirmPassFocus && !validConfirmPass ?
                                                                            styles.instructions : styles.offscreen}`}
                                                            >
                                                            MUST match the first password input filed.                                             
                                                            </p>

                                                    </div>
                                                    <div className={styles.gender_opt_container}>
                                                        <input type="radio" name="radiogroup1" id="rd1" defaultChecked/>
                                                        <label htmlFor="rd1">Male</label>
                                                        <input type="radio" name="radiogroup1" id="rd2"/>
                                                        <label htmlFor="rd2">Female</label>
                                                        <input type="radio" name="radiogroup1" id="rd3"/>
                                                        <label htmlFor="rd2">Divers</label>
                                                    </div>
                                                <div className={styles.term_conditons_container}>
                                                    <input type="checkbox" id="cb1" checked={agreement} onChange={onAgreementChange} />
                                                    <label htmlFor="cb1">I agree with terms and conditions</label>
                                                </div>

                                                <input defaultValue={"Register"}
                                                type="submit"
                                                disabled={ !validusername || !validPass || !validConfirmPass || !validEmail || !agreement ? true : false}           
                                                />
                                            </form>

                                        <p>
                                            Already registerd?<br/>
                                            <span
                                                className={styles.line }
                                                
                                            > 
                                                <Link href={"/login"}><a href='#'>Sign in</a></Link>
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