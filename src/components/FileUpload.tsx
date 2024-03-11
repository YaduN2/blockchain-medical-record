"use client"

import React from "react"
import styles from "@/styles/fileUpload.module.css"
import Image from "next/image"
import * as LitJsSdk from "@lit-protocol/lit-node-client"
import { auth } from "@clerk/nextjs"

function FileUpload() {
  const [file, setFile] = React.useState<File | null>(null)
  const [cid, setCid] = React.useState<string>("")
  const [dycryptionCid, setDecryptionCid] = React.useState<string>("")

  function temp(){
    return 1;
  }

  async function formHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget) 
    const description = formData.get("description") as string
    const file = formData.get("file") as File

    if (description === "" || file === null) {
      alert("Please fill in the description and upload a file")
      return
    }

    //check file size
    if (file.size > 1000000) {
      alert("File size exceeds 1MB")
      return
    }

    // let finalUploadObj = Object.fromEntries(formData.entries())
    // finalUploadObj.date = new Date().toISOString()

    // const litNodeClient = new LitJsSdk.LitNodeClient({
    //   litNetwork: "cayenne",
    // })

    // await litNodeClient.connect()
    // const authSig = await LitJsSdk.checkAndSignAuthMessage({
    //   chain: "ethereum",
    //   nonce: "abcd",
    // })


    // const access = [
    //   {
    //     contractAddress: " ",
    //     standardContractType: " ",
    //     chain: "ethereum",
    //     method: "eth_getBalance",
    //     paramters: [":userAddress", "latest"],
    //     returnValueTest: {
    //       comparator: ">=",
    //       value: "0",
    //     },
    //   },
    // ]

    // // TODO:
    // //in values we set to user address , then only user can decrypt the file
    

    // const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
    //   accessControlConditions: access,
    //   authSig: authSig,
    //   chain: "ethereum",
    //   file: formData.get("file") as File,
    //   readme: `${formData.get("description")} ${new Date().toISOString()}`,
    //   litNodeClient: litNodeClient,
    // })

    // const encryptedBlob = new Blob([encryptedZip], { type: "text/plain" })
    // const encryptedFile = new File([encryptedBlob], "encrypted.zip")

    // formData.set("file", encryptedFile)
 
  

    // before sentind the data to remote server 
    
    // save the file locally in the current directory

    // const reader = new FileReader()
    // reader.readAsDataURL(encryptedFile)
    // reader.onloadend = function () {
    //   const base64data = reader.result
    //   console.log(base64data)
    // }

    let ipfsHash ="";
  

    // fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    // .then((res) =>{
    //   console.log("res", res);
    //   return res.text();
    // }) // Add this line
    // .then((text) => {
    //   ipfsHash = text;
    //   setCid(ipfsHash);
    //   console.log("cid", cid);
    // })
    // .catch((err) => console.log(err))
    // .finally(() => {
    //   console.log("finally");
    // }
    // );

// convert the file to base64 and then send it to the server 

   console.log(file)

  //  make base64 string of the file and send to ipfs

  let reader = new FileReader();
  reader.readAsDataURL(file);
  let base64data = "";
  reader.onloadend = function () {
    let base64data = reader.result;
    console.log(base64data);
    console.log("file", file);
  }

  console.log("base64data", base64data.slice(0, 1000))

  let body_ = {
    pinataContent: {
      name: "afgadf",
      image: base64data.slice(0, 1000)
    }
  }


  try {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZjI0ZTFhZC0wZGJhLTQ0OTEtOTI4My02YzMwODAxMWIyZDEiLCJlbWFpbCI6InJpcm9tYTM5MzZAaGRybG9nLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5MWRiMzM5NzI0ZDIxNDBiYWEzMiIsInNjb3BlZEtleVNlY3JldCI6ImQ4NTFlY2RjZWU2ZmVjY2RhZjYwNWM2OGU0MTk4NzRhODRlZjM4OTRjYzQ4ZmJiOTlkNThhM2FiNDI3ZjQ3ZDkiLCJpYXQiOjE3MTAxODYxNTJ9.i_3z6yOLn89MOxdcP_HChOwbrDLLskXmvQHSdPXrzAE',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body_)
    };
    
    fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

  }catch (e) {
    console.log(e);
  }



}

// -------------------------decryption of the file from cid----------------------






  return (
    <div className={styles.fileUpload}>
      <h1>File Upload</h1>
      <form onSubmit={formHandler} className={styles.form}>
        <div className={styles.textArea}>
          <textarea
            name="description"
            id="description"
            className={styles.textarea}
            cols={50}
            rows={10}
            placeholder="Describe the uploaded files"
          ></textarea>
        </div>

        <div className={styles.upload_section}>
          {/* simple file input  */}
          <input
            type="file"
            name="file"
            id="file"
            className={styles.fileInput}
          />
          <input type="submit" value="Submit" className={styles.submitBtn} />
        </div>
      </form>
    </div>
  )
}

export default FileUpload
