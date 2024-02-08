import React from 'react'
import styles from '@/styles/dashboard.module.css'

function layout({children,
  summary,
  fileUpload,
  appointments,
}: {
  children: React.ReactNode,
  summary: React.ReactNode,
  fileUpload: React.ReactNode,
  appointments: React.ReactNode,
})
 {
  return (
    
    <main className={styles.container}>
      <div className={styles.childrens}>
        {children}
      </div>
      <div className={styles.contents}>
          <div className={styles.left_section}>
              <div className={styles.summary}>
                {summary}
              </div>
              <div className={styles.fileUpload}>
                {fileUpload}
              </div>
          </div>
          <div className={styles.right_section}>
              <div className={styles.appointments}>
                {appointments}
              </div>
          </div>
        </div>
    </main>
    
  )
}

export default layout