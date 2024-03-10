"use client";

import React from 'react'
import styles from "@/styles/fileUpload.module.css"
import Image from "next/image"
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { auth } from '@clerk/nextjs';






function FileUpload() {

  const [file, setFile] = React.useState<File | null>(null);
  const [cid , setCid] = React.useState<string>("");
  const [uploading , setUploading] = React.useState<boolean>(false);
  const [dycryptionCid , setDecryptionCid] = React.useState<string>("");


  async function formHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;
  
    if(description==="" || file===null) {
      alert("Please fill in the description and upload a file")
      return;
    }
  
    //check file size 
    if(file.size > 1000000) {
      alert("File size exceeds 1MB")
      return;
    }
  
    // check file type
    if(!file.type.includes("image")) {
      alert("File type not supported")
      return;
    }
    
    let finalUploadObj = Object.fromEntries(formData.entries());
    finalUploadObj.date = new Date().toISOString();

    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork : "cayenne"
    });

    
    await litNodeClient.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain : "ethereum",
      nonce: "abcd"
    })


const access = [
  {
    contractAddress:" ",
    standardContractType: " ",
    chain : "ethereum",
    method : "eth_getBalance",
    paramters: [":userAddress", "latest"],
    returnValueTest : {
      comparator: ">=",
      value: "0"
    } 
  }
]

const encryptedZip = await  LitJsSdk.encryptFileAndZipWithMetadata({
  accessControlConditions: access,
  authSig: authSig, 
  chain: "ethereum",
  file: formData.get("file") as File,
  readme : `${formData.get("description")} ${formData.get("date")}`,
  litNodeClient : litNodeClient
})

  const encryptedBlob = new Blob([encryptedZip], {type: "text/plain"});
  const encryptedFile = new File([encryptedBlob], "encrypted.zip");

  formData.set("file", encryptedFile);
  formData.delete("description");




  fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify(finalUploadObj)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      alert("File uploaded successfully")
    })
    .catch(err => console.log(err))
  
    e.currentTarget.reset();
  }
  




  return (

    <div className={styles.fileUpload}>
      <h1>File Upload</h1>
      <form onSubmit={formHandler} className={styles.form}>
 

        <div className={styles.textArea}>
          <textarea name="description" id="description" className={styles.textarea} cols={50} rows={10} placeholder="Describe the uploaded files" ></textarea>
        </div>

        <div className={styles.upload_section}>

          {/* simple file input  */}
          <input type="file" name="file" id="file" className={styles.fileInput} />
          <input type="submit" value="Submit" className={styles.submitBtn} />

        </div>


      </form>
    </div>
   
  )
}

export default FileUpload