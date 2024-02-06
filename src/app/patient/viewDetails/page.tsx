import React from "react";
import styles from "@/styles/viewDetails.module.css";
import * as LR from '@uploadcare/blocks';
import { PACKAGE_VERSION } from '@uploadcare/blocks';

LR.registerBlocks(LR);


const viewDetails = () => {
  return (
    <>
      <div className={styles.container}>
          <div className="detail_section">

          </div>
          <div className="upload_section">
            <p>Upload File </p>
            <lr-config  
                ctx-name="my-uploader"
                pubkey="2b7f257e8ea0817ba746"
                sourceList="local, url, camera, dropbox"
            ></lr-config>
            <lr-file-uploader-regular
                ctx-name="my-uploader"
                //temp fix
                css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
            ></lr-file-uploader-regular>
          </div>
        </div>
    </>
  );
};

export default viewDetails;
