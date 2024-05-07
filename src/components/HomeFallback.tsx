import React from 'react'
import Image from 'next/image'
import styles from '@/styles/homeFallback.module.css'
import pic from "../../public/001234.png"
import Link from 'next/link'

function HomeFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.landing_page}>
        <div className={styles.text_section}>
          <h1> Secure Your Medical  <br/>Records with us </h1>
          <p>
            Your medical records are important and should be kept secure.
            <br/>We provide a secure platform for you to store and access <br/>
            your medical records.
          </p>
          <Link href="/sign-up" className="bg-[#333333] rounded-md px-4 py-2 m-1 text-white font-semibold"> Sign Up </Link>
          <Link href="/sign-in" className="bg-[#333333] rounded-md px-4 py-2 m-1 text-white font-semibold"> Log In </Link>
        </div>
        <div className={styles.img_section}>
          <Image src={pic} alt="medical records" />
        </div>
      </div>
    </div>





  )
}

export default HomeFallback