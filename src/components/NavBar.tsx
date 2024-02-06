"use Client";

import Link from "next/link";
import styles from "..//styles/Navbar.module.css";
import { Router } from "next/router";
import { useContext } from "react";
import { appContext } from "@/context/appcontext";
import { usePathname } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import {useRef, useState } from 'react';

const Navbar = () => {

  const [isLogged , setIsLogged] = useContext(appContext) ?? [0, () => {}];
  const path = usePathname();

  const list = [
    {
      link : "doctor",
      path : "/doctor",
    },
    {
      link : "patient",
      path : "/patient",
    }
  ]

  const hoverRef = useRef<HTMLDialogElement>();
  const [open , setOpen] = useState(false);

  function handleClick(){

    setOpen(prev=>!prev);
    if(!open){
      hoverRef.current.style.display = "block";
    }else{
      hoverRef.current.style.display = "none";
    }
  }

    
  function closeModal(){
    hoverRef.current.style.display = "none";
    setOpen(false);
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">BlockRecords</Link>
      </div>
      <div className={styles.navLinks}>
        {!!isLogged && <Link href="/appointments">Appointments</Link>}
        <Link href="/contact">contact</Link>
        {
          // logic missing ---------------- logout button
          isLogged>0 ? (
            <>
             { isLogged===1 ?  <Link href="/doctor">Doctor</Link>  : <Link href="/patient">Doctor</Link>}
             <button name="profile" onClick={handleClick}>
              <RxAvatar />
             </button>
              <div className={styles.content} ref={hoverRef}>
               <ul>
                <li><Link className={styles.profile_link}  href="/profile">Profile</Link></li>
                <li><button className={styles.btn} name="logOut" onClick={()=>setIsLogged(0)}>Logout</button></li>
                <li><button className={styles.btn} onClick={closeModal}>Close</button></li>
               </ul>
              </div>
            </>
          ) : (<>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
          </>)
        }
      </div>
    </nav>
  );
};

export default Navbar;
