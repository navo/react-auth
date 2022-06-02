import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { myContext } from '../Pages/Context'
import Axios, { AxiosResponse } from 'axios';
import { findEnv } from '../helper/FindEnv';

export default function NavBar() {
  const ctx = useContext(myContext);

  const logout = () => {
    Axios.get(`${findEnv()}/api/logout`, {
      withCredentials: true
    }).then((res : AxiosResponse) => {
      if (res.data === "success") {
        window.location.href = "/";
      }
    })
  }
  return (
    <div className="NavContainer">
      {ctx ? (
        <>
          <Link onClick={logout} to="/logout">Logout</Link>
          {ctx.isAdmin ? (<Link to="/admin">Admin</Link>) : null}
          <Link to="/profile">Profile</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>  
        </>
      )
      }
      <Link to="/">Home</Link>
    </div>
  )
}
