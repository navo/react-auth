import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios';
import { findEnv } from '../helper/FindEnv';

export default function Login() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")


  const login = () => {
    axios.post(`${findEnv()}/api/login`, {
      username,
      password
    }, {
      withCredentials: true
    }).then((res : AxiosResponse) => {
      if (res.data === "success") {
       window.location.href = "/"
     }
    }, () => {
      console.log("Failure");
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <input type="text" placeholder='username' onChange={e => setUsername(e.target.value)}/>
      <input type="text" placeholder='password' onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}
