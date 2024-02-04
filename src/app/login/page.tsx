"use client";

import React from 'react'
import {useState} from 'react';
import {appContext} from '@/context/appcontext';
import {useContext} from 'react';
import { usePathname } from 'next/navigation';
import styles from "@/styles/login.module.css";
import {useRouter} from 'next/router';


 const login = () => {

  const [user , setUser] = useState({
    name: "",
    passwd: ""
  });

  const [isLogged , setIsLogged] = useContext(appContext) ?? [null, () => {}];
  const path = usePathname();
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault
    console.log(user , path);

    if(path=="/patient")
      setIsLogged(1);
    else if(path=="/doctor")
      setIsLogged(2);

      //error here , 
    router.push("/");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" required placeholder="username" value={user.name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setUser({...user , name: e.target.value})} ></input>
        <input type="password" required placeholder="password" value={user.passwd} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setUser({...user , passwd: e.target.value})} ></input>
        <p className={styles.temp}>Some <span>biometric</span> / <span>wallet passphrase</span> /  <span>mfa</span> ..... </p>
        <input type="submit"  value="Submit" />
      </form>



    </div>
  )
}

export default login
