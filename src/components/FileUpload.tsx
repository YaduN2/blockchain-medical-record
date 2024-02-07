"use client";

import React from 'react'
import * as LR from '@uploadcare/blocks';
import { PACKAGE_VERSION } from '@uploadcare/blocks';
import styles from "@/styles/fileUpload.module.css"


LR.registerBlocks(LR);
LR.FileUploaderRegular.shadowStyles = /* CSS */ `
  :host lr-simple-btn button {
    background-color: #333333;
    color: white;
  }
`;


function FileUpload() {
  return (
    <div className={styles.container}>
            <div className={styles.text_section}>
              <div className={styles.text} >
                  Descrption    
              </div>
              <div className={styles.decription} >
                <form>
                  <textarea placeholder="Debreif uploaded document ..." className={styles.text_area}  id="description" name="description" rows={8} cols={50}></textarea>
                </form>
              </div>
            </div>
            <div className={styles.upload_section} >
            <lr-config  
                ctx-name="my-uploader"
                pubkey="2b7f257e8ea0817ba746"
                sourceList="local, camera , dropbox"
                maxLocalFileSizeBytes={10000000}
                multiple={false}                
            ></lr-config>
            <lr-file-uploader-regular
                ctx-name="my-uploader"
                // temp fix
                css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
            ></lr-file-uploader-regular>
          </div>
    </div>
  )
}

export default FileUpload