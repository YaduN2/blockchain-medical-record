"use client"

import React from "react"
import styles from "@/styles/fileUpload.module.css"
import Image from "next/image"
import * as LitJsSdk from "@lit-protocol/lit-node-client"
import { auth } from "@clerk/nextjs"
import { useState } from "react"
import axios from "axios"
import { endianness } from "os"
import { updatePatientIpfs,getIpfsCID } from "@/lib/contract_api"

function FileUpload() {
  const [cid, setCid] = React.useState<string>("")
  const [decryptionCid, setDecryptionCid] = React.useState<string>("")

  
  const [fileImg, setFileImg] = useState(null)

  const sendFileToIPFS = async (e: any) => {
    e.preventDefault()
    if (fileImg) {
      try {
        const litNodeClient = new LitJsSdk.LitNodeClient({
          litNetwork: "cayenne",
        })
        // Then get the authSig
        await litNodeClient.connect()
        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: "ethereum",
          nonce: "abcdefghijkl",
        })

        const accs = [
          {
            contractAddress: "",
            standardContractType: "",
            chain: "ethereum",
            method: "eth_getBalance",
            parameters: [":userAddress", "latest"],
            returnValueTest: {
              comparator: ">=",
              value: "1000000000000", // 0.000001 ETH
            },
          },
        ]

        const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
          accessControlConditions: accs,
          authSig,
          chain: "ethereum",
          file: fileImg,
          litNodeClient: litNodeClient,
          readme: "Use IPFS CID of this file to decrypt it",
        })

        // Then we turn it into a file that will be accepted by the Pinata API
        const encryptedBlob = new Blob([encryptedZip], {
          type: "text/plain",
        })

        const encryptedFile = new File([encryptedBlob], fileImg.name)

        const formData = new FormData()
        formData.append("file", encryptedFile)


        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "8047bdf01657dde467ce",
            pinata_secret_api_key: "ee9abb294e8419a32549eba4608058aa93cbe14c22fc6b532a1bb413e061c718",
            "Content-Type": "multipart/form-data",
           },
        })
        
        
        // ----------------------------------------------

        let ipfsHash = await getIpfsCID()
        let ipfsUrl  = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`
       
        let record="" 
        fetch(ipfsUrl).
        then((res)=>res.json())
        .then(res=>{record = res})

        if (record) {
          record.data.fileList = [...record.data?.fileList, resFile.data.IpfsHash];
        }
        
        
        const storeBlock = await updatePatientIpfs(JSON.stringify(record))
        
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`
        console.log(ImgHash)
      } catch (error) {
        console.log("Error sending File to IPFS: ")
        console.error(error)
      }
    }
    
  }


  const decryptFile = async (fileToDecrypt) => {
    try {
      // First we fetch the file from IPFS using the CID and our Gateway URL, then turn it into a blob
      const fileRes = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${fileToDecrypt}?filename=encrypted.zip`
      );
      const file = await fileRes.blob();
      // We recreated the litNodeClient and the authSig
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "cayenne",
      });
      await litNodeClient.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
        nonce: "abcdefghijkl",
      });
      // Then we simpyl extract the file and metadata from the zip
      // We could do more with this, like try to display it in the app UI if we wanted to
      const { decryptedFile, metadata } =
        await LitJsSdk.decryptZipFileWithMetadata({
          file: file,
          litNodeClient: litNodeClient,
          authSig: authSig,
        });
      // After we have our dcypted file we can download it
      const blob = new Blob([decryptedFile], {
        type: "application/octet-stream",
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = metadata.name;
      downloadLink.click(); // Use the metadata to get the file name and type
    } catch (error) {
      alert("Trouble decrypting file");
      console.error(error);
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
          <input type="submit" value="Submit" className="bg-blue-400 px-2 py-1 rounded-md shadow text-white m-1" />
        </div>
      </form>
      <div>
        <input type="text" onChange={(e) => setDecryptionCid(e.target.value)} />
        <button onClick={() => decryptFile(decryptionCid)} className="bg-blue-400 px-2 py-1 rounded-md shadow text-white m-1">Decrypt</button>
      </div>
    </div>
  )
}

export default FileUpload
