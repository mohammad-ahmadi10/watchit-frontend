import React, { useState } from 'react'
import { NextPageContext } from 'next';
import { useRouter } from 'next/router'
import costumAxios from "../../utils/axios";
import styles from "../../styles/forgot.module.scss";
import { Button, Form, Input , notification } from 'antd';
import {VscWorkspaceTrusted} from "react-icons/vsc";



function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  const [iconSize , setIconSize] = useState(40);
  const [password , setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading ,setLoading] = useState(false);

  /* opens a notification */
  const openNotification = (content:React.ReactNode) => {
    notification.open({
      message: content,
      style: {
        width: 300,
      },
    });
  }

    /* renders icon from react-icons */
    const displayIcon = (ICON:any, color?:string, size?:number) =>  { 
      return  <ICON size={size ? size : iconSize} style={{pointerEvents:"none", color:color}}/>
    }
    
  /* handles resets password and sends it to the server */
  const onResetPassword = async (values: any) =>{
    if(password.length <=0 || confirmPassword.length <=0)
     return
     
     setLoading(true);

     const res = await costumAxios.post("/auth/resetpassword", {
      newPassword:password,
      id:token
     })
     console.log(res)
     if(res){
      
      if(res.status === 200) {
        openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "Green")} <span style={{marginLeft:10}}>successfully changed!</span></div>)
        setTimeout(() =>{
          router.replace("/login")
        },1000)
      } 
      else{
        openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "red")} <span style={{marginLeft:10}}>there is something wrong with your password!</span></div>)
      }
    }
    setLoading(false);

  } 

 
  /* saves new given password */
  const onPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const inputElement = e.target as HTMLInputElement;
    setPassword(inputElement.value)
}
/* saves confirm password */
const onConfirmPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const inputElement = e.target as HTMLInputElement;
    setConfirmPassword(inputElement.value)
}


  return (
    
    <section className={styles.forgotPassContainer}>
        <div className={styles.resetWrapper} >

            <h1>Reset Your password</h1>
            <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onResetPassword}
      autoComplete="off"
    >
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password
                            onChange={onPassChange}
                            value={password}
        />
      </Form.Item>
      <Form.Item
        label="confirm"
        name="confirm password"
        rules={[{ required: true, message: 'Please confrim your password!' }]}
      >
        <Input.Password 
                            value={confirmPassword}
                            onChange={onConfirmPassChange}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading} disabled={ (password.length <= 0 || confirmPassword.length <= 0) ||  password !== confirmPassword }>
          Submit
        </Button>
      </Form.Item>
    </Form>    
        </div>
    </section>
  )
}




export default ResetPassword