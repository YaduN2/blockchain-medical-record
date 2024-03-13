"use client";

import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { RxAvatar } from "react-icons/rx";
import {auth} from "@clerk/nextjs" 
import { UserButton } from "@clerk/nextjs";
import { useUser } from '@clerk/clerk-react';



const Navbar = () => {
  
  const {isSignedIn } = useUser();
  console.log("userId: ", isSignedIn);

  return (
    <div className={styles.container}>
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">BlockRecords</Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/" >Home</Link>
        {isSignedIn ?<><Link href="/dashboard">Dashboard</Link></>
              :<> <Link href="/sign-in">Sign in</Link><Link href="/sign-up">Sign up</Link></>
        }
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
