import React, { useState } from 'react'
import costumAxios from "../utils/axios";
import { useSelector } from 'react-redux';
import { selectUser } from '../src/store';
import styles from "../styles/forgot.module.scss";
import { Button ,  Input, Form , notification } from 'antd';
import {VscWorkspaceTrusted} from "react-icons/vsc";

function Forgotpassword() {
  const [email , setEmail] = useState("");
  const [message,setMessage] = useState("");
  const errorMessage = useSelector(selectUser).errorMSG
  const [isLogging , setIslogging] = useState(false);
  const [iconSize , setIconSize] = useState(40);
  const openNotification = (content:React.ReactNode) => {
    notification.open({
      message: content,
      style: {
        width: 300,
      },
    });
  }

  /* render icon from react-icons */
const displayIcon = (ICON:any, color?:string, size?:number) =>  { 
  return  <ICON size={size ? size : iconSize} style={{pointerEvents:"none", color:color}}/>
}


  const onForgotPassSubmit = async (e:React.MouseEvent<HTMLFormElement>) =>{
    setIslogging(true)
     e.preventDefault();
     const res = await costumAxios.post("/auth/resetconfirm", {
      email:email,
     })
     
     if(typeof res === "undefined"){
      openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "green")} <span style={{marginLeft:10}}>Please check your Email, to reset your Password</span></div>)
      setIslogging(false)
    }else{
      if(res.status === 200){
        openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "red")} <span style={{marginLeft:10}}>{res.data?.mssg}</span></div>)
        setMessage(res.data?.mssg)

      }
      openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "red")} <span style={{marginLeft:10}}>Email is not correct!</span></div>)
      setIslogging(false)
    }

  } 

const onEmailChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const inputElement = e.target as HTMLInputElement;
    setEmail(inputElement.value)
}

  return (
    
    <section className={styles.forgotPassContainer}>
        <div className={styles.wrapper}>
        <p>{message?message:""}</p>

        <h1>Forget Password</h1>
            <p>Seems like you forgot your password.
               If this is true, enter your Email 
               to get  your password reseted</p>

               <Form
      name="basic"
      labelCol={{ span: 20 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
<Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
                                                            <Input 
                                                              placeholder='example@gmail.com' 
                                                              onChange={onEmailChange}
                                                              value={email}
                                                              htmlType={"email"}
                                                              rules={[{ required: true , type:"email"}]}
                                                              required
                                                              style={{borderRadius:"0px", height:"50px"}}
                                                            />

      </Form.Item>
      <Form.Item>
      <Button type="primary" htmlType="submit" ghost disabled={ false }
                                                            className={styles.button}  onClick={onForgotPassSubmit }  loading={isLogging}>
                                                             Send
                                                            </Button>

      </Form.Item>

      </Form>
        </div>
    </section>
  )
}




export default Forgotpassword