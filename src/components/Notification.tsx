import React from 'react'
import  Image  from 'next/image';
import Link from 'next/link'
import styles from '@/styles/notification.module.css'
import avatar from '../../public/profile.jpg'


function Notification() {
  return (

        <div className={styles.container}>
          <div className={styles.notification_bar}>
            <div className={styles.header}>
              <h2> Notifications </h2>
            </div>
            <div className={styles.notification_content}>
              <div className={styles.notification_group}>
                <div className={styles.notification_list}>

                    <div className={styles.notification_item}>
                      <div className={styles.notification_item_content}>
                        <div className={styles.notification_item_text}>
                          <div className={styles.heading}>Dental Checkup </div>
                          <div className={styles.description}>
                            <p> You have an appointment with Dr. John Doe at 10:00 am , on Sunday , March 14</p>
                          </div>
                        </div>
                        <div className={styles.notification_item_avatar}>
                          <Image src={avatar} alt="profile" width={50} height={50} />
                        </div>
                      </div>
                    </div>
                   
   
            
                   
                    <div className={styles.notification_item}>
                      <div className={styles.notification_item_content}>
                        <div className={styles.notification_item_text}>
                          <div className={styles.heading}>Dental Checkup </div>
                          <div className={styles.description}>
                            <p> You have an appointment with Dr. John Doe at 10:00 am , on Sunday , March 14</p>
                          </div>
                        </div>
                        <div className={styles.notification_item_avatar}>
                          <Image src={avatar} alt="profile" width={50} height={50} />
                        </div>
                      </div>
                    </div>


                    

                </div>
              </div>
            </div>
          </div>
        </div>

    )
}

export default Notification