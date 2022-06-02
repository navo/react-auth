import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'
import Axios, { AxiosResponse } from 'axios'
import { UserInterface } from '../Interfaces/Interfaces'
import { findEnv } from '../helper/FindEnv'

export const myContext = createContext<Partial<UserInterface>>({})
export default function Context(props: PropsWithChildren<any>) {
  const [user,setUser] = useState<UserInterface>()
  useEffect(() => {
    Axios.get(`${findEnv()}/api/user`, { withCredentials: true }).then((res: AxiosResponse) => {
      setUser(res.data);
    })
  }, []);

  return (
    <myContext.Provider value={user!}>{props.children}</myContext.Provider>
    )
}
