"use client"
import React from "react"
import styles from "@/styles/dashboard.module.css"
import { useState } from "react"
import { UserProfile } from "@clerk/nextjs"
import { updatePatientIpfs } from "@/lib/contract_api"

function layout({
  children,
  summary,
  fileUpload,
  appointments,
  uploadedFiles,
  accessFiles
}: {
  children: React.ReactNode
  summary: React.ReactNode
  fileUpload: React.ReactNode
  appointments: React.ReactNode
  uploadedFiles: React.ReactNode
  accessFiles: React.ReactNode
}) {
  const [active, setActive] = React.useState("Profile")

  return (
    <div className={styles.mainContainer}>
      <main className={styles.container}>
        <section className={styles.main_content}>
          <div className={styles.left_section}>
            <div className={styles.list_div}>
              <ul className={` text-md font-bold `}>
                {/* <li className={styles.li_item} >Profile</li>
                <li className={styles.li_item}>File Upload</li>
                <li className={styles.li_item}>Summary</li>
                <li className={styles.li_item}>Appointments</li> */}

                <li
                  className={`px-2 py-4 bg-white cursor-pointer `}
                  onClick={() => setActive("Profile")}
                >
                  Profile
                </li>
                <li
                  className={`px-2 py-4 bg-white cursor-pointer `}
                  onClick={() => setActive("File Upload")}
                >
                  File Upload
                </li>
                <li
                  className={`px-2 py-4 bg-white cursor-pointer `}
                  onClick={() => setActive("Summary")}
                >
                  Summary
                </li>
                <li
                  className={`px-2 py-4 bg-white cursor-pointer `}
                  onClick={() => setActive("Appointments")}
                >
                  Give Access
                </li>
                <li
                  className={`px-2 py-4 bg-white cursor-pointer `}
                  onClick={() => setActive("uploadedFiles")}
                >
                  Your Files
                </li>
                <li
                  className={`px-2 py-4 bg-white cursor-pointer `}
                  onClick={() => setActive("accessFiles")}
                >
                  Access Files
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
              {active === "accessFiles" && accessFiles}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default layout
