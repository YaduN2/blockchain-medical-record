"use Client";

import Link from "next/link";
import styles from "..//styles/Navbar.module.css";
import { Router } from "next/router";
import { useContext } from "react";
import { appContext } from "@/context/appcontext";
import { usePathname } from "next/navigation";

const Navbar = () => {

  const [isLogged , setIsLogged] = useContext(appContext) ?? [null, () => {}];
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">BlockRecords</Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/doctor">Doctor</Link>
        <Link href="/patient">Patient</Link>
        {<Link href="/login">Login</Link>}
        { <Link href="/register">Register</Link>}
        {isLogged===0 && path!="login" && <Link href="/login">Login</Link>}
        {isLogged===0 && path!="register" && <Link href="/register">Register</Link>} 
      </div>
    </nav>
  );
};

export default Navbar;
