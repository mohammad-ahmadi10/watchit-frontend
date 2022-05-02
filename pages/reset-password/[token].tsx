import React, { useState } from 'react'
import { NextPageContext } from 'next';
import { useRouter } from 'next/router'
import costumAxios from "../../utils/axios";

function ResetPassword() {
  const router = useRouter()
  const { token } = router.query

  const [password , setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const onResetPassword = async (e:React.MouseEvent<HTMLFormElement>) =>{
    e.preventDefault()

    if(password.length <=0 || confirmPassword.length <=0)
     return

     const res = await costumAxios.post("/auth/resetpassword", {
      newPassword:password,
      id:token
     })
     console.log(res)
     if(res){
      if(res.status === 200) {
        setTimeout(() =>{
          router.replace("/login")
        },250)
      }
    }
  } 

 
  const onPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const inputElement = e.target as HTMLInputElement;
    setPassword(inputElement.value)
}
const onConfirmPassChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const inputElement = e.target as HTMLInputElement;
    setConfirmPassword(inputElement.value)
}

  return (
    
    <section>
        <div>

            <h1>Reset Your password</h1>
            <form onSubmit={onResetPassword}>
                <div>
                    <input type="password" 
                    onChange={onPassChange}
                    required
                    placeholder='password'
                    value={password}/>

                    <input type="password" 
                    placeholder='confirm password' 
                    onChange={onConfirmPassChange}
                    value={confirmPassword}
                    required/>
                    <input type="submit" defaultValue={"Reset"} />
                </div>
            </form>
        </div>
    </section>
  )
}




export default ResetPassword