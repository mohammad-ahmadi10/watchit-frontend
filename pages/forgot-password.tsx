import React, { useState } from 'react'
import costumAxios from "../utils/axios";
import { useSelector } from 'react-redux';
import { selectUser } from '../src/store';


function Forgotpassword() {
  const [email , setEmail] = useState("");
  const [message,setMessage] = useState("");
  const errorMessage = useSelector(selectUser).errorMSG

  const onForgotPassword = async (e:React.MouseEvent<HTMLFormElement>) =>{
    
     e.preventDefault();
     const res = await costumAxios.post("/auth/resetconfirm", {
      email:email,
     })
     
     if(typeof res === "undefined"){
      console.log(errorMessage)
      const {mssg} = errorMessage!;
      setMessage(mssg)
    }else{
      if(res.status === 200){
        setMessage(res.data?.mssg)
      }
    }

  } 

const onEmailChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const inputElement = e.target as HTMLInputElement;
    setEmail(inputElement.value)
}

  return (
    
    <section>
        <div>
        <p>{message?message:""}</p>
        <h1>Forget Password</h1>
            <p>Seems like you forgot your password.
               If this is true, enter your Email 
               to get reset your password</p>

            <form onSubmit={onForgotPassword}>
                <div>
                    <input type="email" 
                    placeholder='example@gmail.com' 
                    onChange={onEmailChange}
                    value={email}
                    required/>
                    <input type="submit" defaultValue={"Get reset email"}/>
                </div>
            </form>
        </div>
    </section>
  )
}




export default Forgotpassword