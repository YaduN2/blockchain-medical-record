"use client"
import React from "react"
import styles from "@/styles/dashboard.module.css"
import { useState } from "react"
import { UserProfile } from "@clerk/nextjs"
import { updatePatientIpfs } from "@/lib/contract_api"

function layout({
  children,
  summary,
  uploadedFiles,
  fileUpload,
  appointments,
}: {
  children: React.ReactNode
  summary: React.ReactNode
  fileUpload: React.ReactNode
  appointments: React.ReactNode
}) {
  const [active, setActive] = React.useState("Profile")

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.h1}>Dashboard</h1>
      <main className={styles.container}>
        <section className={styles.main_content}>
          <div className={styles.left_section}>
            <div className={styles.list_div}>
              <ul className={styles.ul}>
                {/* <li className={styles.li_item} >Profile</li>
                <li className={styles.li_item}>File Upload</li>
                <li className={styles.li_item}>Summary</li>
                <li className={styles.li_item}>Appointments</li> */}

                <li
                  className={styles.li_item }
                  onClick={() => setActive("Profile")}
                >
                  Profile
                </li>
                <li
                  className={styles.li_item }
                  onClick={() => setActive("File Upload")}
                >
                  File Upload
                </li>
                <li
                  className={styles.li_item }
                  onClick={() => setActive("Summary")}
                >
                  Summary
                </li>
                <li
                  className={styles.li_item }
                  onClick={() => setActive("Appointments")}
                >
                  Appointments
                </li>
                <li
                  className={styles.li_item }
                  onClick={() => setActive("uploadedFiles")}
                >
                  Files
                </li>
              </ul>
            </div>
          </div>
            <div className={styles.right_section}>
            <div className={styles.childrens}>{children}</div>

            <div className={styles.contents_}>
              {/*             
              <div className={styles.summary}>{summary}</div>
              <div className={styles.fileUpload}>{fileUpload}</div>
              <div className={styles.appointments}>{appointments}</div>
          */}

              {active === "Profile" && <UserProfile />}
              {active === "File Upload" && fileUpload}
              {active === "Summary" && summary}
              {active === "Appointments" && appointments}
              {active === "uploadedFiles" && uploadedFiles}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default layout
