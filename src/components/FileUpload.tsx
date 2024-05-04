"use client";

import React from "react";
import styles from "@/styles/fileUpload.module.css";
import Image from "next/image";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { auth } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { endianness } from "os";
import {updatePatientIpfs} from "@/lib/contract_api"

function FileUpload() {
  const [cid, setCid] = React.useState<string>("");
  const [dycryptionCid, setDecryptionCid] = React.useState<string>("");

  // const uploadIPFS = async () => {
  //   const uploadURL = await upload({
  //     data: [file],
  //     options: {
  //       uploadWithGatewayUrl: true,
  //       uploadWithoutDirectory: true,
  //     },
  //   });
  //   console.log("uploadURL", uploadURL);
  // };

  // function temp() {
  //   return 1;
  // }

  // async function formHandler(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();

  //   const formData = new FormData(e.currentTarget);
  //   const description = formData.get("description") as string;
  //   const file = formData.get("file") as File;

  //   if (description === "" || file === null) {
  //     alert("Please fill in the description and upload a file");
  //     return;
  //   }

  //   //check file size
  //   if (file.size > 1000000) {
  //     alert("File size exceeds 1MB");
  //     return;
  //   }

  //   let finalUploadObj = Object.fromEntries(formData.entries());
  //   finalUploadObj.date = new Date().toISOString();

  //   const litNodeClient = new LitJsSdk.LitNodeClient({
  //     litNetwork: "cayenne",
  //   });

  //   await litNodeClient.connect();
  //   const authSig = await LitJsSdk.checkAndSignAuthMessage({
  //     chain: "ethereum",
  //     nonce: "abcd",
  //   });

  //   const access = [
  //     {
  //       contractAddress: " ",
  //       standardContractType: " ",
  //       chain: "ethereum",
  //       method: "temp",
  //       paramters: [":userAddress", "latest"],
  //       returnValueTest: {
  //         comparator: "===",
  //         value: "0",
  //       },
  //     },
  //   ];

  //   // TODO:
  //   //in values we set to user address , then only user can decrypt the file

  //   const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
  //     accessControlConditions: access,
  //     authSig: authSig,
  //     chain: "ethereum",
  //     file: formData.get("file") as File,
  //     readme: `${formData.get("description")} ${new Date().toISOString()}`,
  //     litNodeClient: litNodeClient,
  //   });

  //   const encryptedBlob = new Blob([encryptedZip], { type: "text/plain" });
  //   const encryptedFile = new File([encryptedBlob], "encrypted.zip");

  //   formData.set("file", encryptedFile);

  //   // before sentind the data to remote server

  //   // save the file locally in the current directory

  //   // const reader = new FileReader()
  //   // reader.readAsDataURL(encryptedFile)
  //   // reader.onloadend = function () {
  //   //   const base64data = reader.result
  //   //   console.log(base64data)
  //   // }

  //   let ipfsHash = "";

  //   // const response_fetch = await fetch("/api/upload", {
  //   //   method: "POST",
  //   //   body: formData,
  //   // })
  //   //   .then((res) => {
  //   //     console.log("res", res);
  //   //     console.log(formData.get("file"));
  //   //     return res.text();
  //   //   }) // Add this line
  //   //   .then((text) => {
  //   //     ipfsHash = text;
  //   //     setCid(ipfsHash);
  //   //     console.log("cid", cid);
  //   //   })
  //   //   .catch((err) => console.log(err));
  // }

  // -------------------------decryption of the file from cid----------------------

  const [fileImg, setFileImg] = useState(null);

  const sendFileToIPFS = async (e: any) => {
    e.preventDefault();
    console.time("upload");
    if (fileImg) {
      try {

        const formData = new FormData();
        
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "8047bdf01657dde467ce",
            pinata_secret_api_key:
              "ee9abb294e8419a32549eba4608058aa93cbe14c22fc6b532a1bb413e061c718",
            "Content-Type": "multipart/form-data",
          },
        })

        const storeBlock = await updatePatientIpfs(resFile.data.IpfsHash);
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);


      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.fileUpload}>
      <h1>File Upload</h1>
      <form onSubmit={sendFileToIPFS} className={styles.form}>
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
          <input
            type="file"
            name="file"
            id="file"
            className={styles.fileInput}
            onChange={(e) => setFileImg(e.target.files[0])}
          />
          <input type="submit" value="Submit" className={styles.submitBtn} />
        </div>
      </form>
    </div>
  );
}

export default FileUpload;
