import React from 'react'
import Image from 'next/image'
import styles from '@/styles/homeFallback.module.css'
import pic from "../../public/001234.png"

function HomeFallback() {
  return (

    //make a fallback page for the home page with good UI showing some importance of securing medical records
    <div className={styles.container}>
      <div className={styles.landing_page}>
        <div className={styles.text_section}>
          <h1> Secure Your Medical  <br/>Records with us </h1>
          <p>
            Your medical records are important and should be kept secure.
            <br/>We provide a secure platform for you to store and access <br/>
            your medical records.
          </p>
          <button> Signin </button>
          <button> Login </button>
        </div>
        <div className={styles.img_section}>
          <Image src={pic} alt="medical records" />
        </div>
      </div>
    </div>





  )
}

export default HomeFallback