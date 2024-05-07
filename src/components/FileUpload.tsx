"use client"

import React, { useEffect } from "react"
import styles from "@/styles/fileUpload.module.css"
import Image from "next/image"
import * as LitJsSdk from "@lit-protocol/lit-node-client"
import { auth } from "@clerk/nextjs"
import { useState } from "react"
import axios from "axios"
import { endianness } from "os"
import { updatePatientIpfs, getIpfsCID } from "@/lib/contract_api"
import { set } from "mongoose"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"




function FileUpload() {

  const [walletAddr, setWalletAddr] = useState();

  

  const [recordTableHash,setRecordTableHash] = useState({
    data: {
      fileList: [],
      accessList: [],
      timestamp: new Date().toISOString(),
    },
  });

  const getWalletAddress = async () => {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    }).then(res=>{
      setWalletAddr(res[0]);
    })
    return account
  }


  async function  getTableHash() {
    let tableHash = await getIpfsCID()
    .then((ipfsHash) => {
      setRecordTableHash(ipfsHash)
      return ipfsHash
    })
  }


  useEffect(()=>{
    getTableHash()
  },[recordTableHash])

  useEffect(()=>{
    getWalletAddress();
  },[])

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

        // const accs = [
        //   {
        //     contractAddress: "",
        //     standardContractType: "",
        //     chain: "ethereum",
        //     method: "eth_getBalance",
        //     parameters: [":userAddress", "latest"],
        //     returnValueTest: {
        //       comparator: "=",
        //       value: "0", // 0.000001 ETH
        //     },
        //   },
        // ]

        let patientAddress=walletAddr
        const accs = [
          {
            contractAddress: "ipfs://QmVHoFLBnbnShkU1Abc41w6g3NGxMAi3fS5iZTGqXgxFLH",
            standardContractType: "LitAction",
            chain: "ethereum",
            method: "livin",
            parameters: [
              ":userAddress",
              `${patientAddress}`.trim(),
              `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
            ],
            returnValueTest: {
              comparator: "=",
              value: "true",
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
            pinata_secret_api_key:
              "ee9abb294e8419a32549eba4608058aa93cbe14c22fc6b532a1bb413e061c718",
            "Content-Type": "multipart/form-data",
          },
        })

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`
        console.log(ImgHash)

        // ----------------------------------------------
        let record

        await getIpfsCID()
          .then((ipfsHash) => {
            if (ipfsHash) {
              let ipfsUrl = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`

              fetch(ipfsUrl)
                .then((res) => res.json())
                .then((record) => {
                  console.log("old record:", record.Record.data)
                  let newRecord
                  if (record){
                    newRecord = {
                      data: {
                        fileList: [
                          ...record.Record.data.fileList,
                          resFile.data.IpfsHash,
                        ],
                        accessList: [...record.Record.data.accessList],
                        timestamp: new Date().toISOString(),
                      },
                    }
                  }else{
                    newRecord = {
                      data: {
                        fileList: [resFile?.data?.IpfsHash],
                        accessList: [...record.Record.data.accessList],
                        timestamp: new Date().toISOString(),
                      },
                    }
                  }

                  setRecordTableHash(newRecord)
                  console.log("new record:", newRecord)

                  return newRecord
                })
                .then((newRecord) => {
                  return JSON.stringify(newRecord)
                })
                .then((newRecordTable) => {
                  const options = {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNmE3N2FhNy04NDI2LTQ1OTAtYWJlYS1mNzA1ZjIyNmVhZjkiLCJlbWFpbCI6ImJ1enpsaWdodDY5NDIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MDQ3YmRmMDE2NTdkZGU0NjdjZSIsInNjb3BlZEtleVNlY3JldCI6ImVlOWFiYjI5NGU4NDE5YTMyNTQ5ZWJhNDYwODA1OGFhOTNjYmUxNGMyMmZjNmI1MzJhMWJiNDEzZTA2MWM3MTgiLCJpYXQiOjE3MTAxOTIxOTF9.QUArqSEjo8zxqGGVL-aw1LlLRY2RmBQ2FRvFfjSNw_E`,
                      "Content-Type": "application/json",
                    },
                    // '{"pinataMetadata":{"name":"addr","keyvalues":{"userAddr":"0x01"}}}'
                    body: `{"pinataContent":{"Record": ${newRecordTable}},"pinataMetadata":{"name": "${walletAddr}" } }`,
                  }
                  let updatedHash

                  fetch(
                    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                    options
                  )
                    .then((response) => response.json())
                    .then((response) => {
                      updatedHash = response.IpfsHash
                      console.log("updated record Table ", response)
                      const storeBlock = updatePatientIpfs(updatedHash)
                      console.log("storeBlock:", storeBlock)
                    }).then((_)=>{
                      toast.success("File Uploaded Successfully")
                    })
                    .catch((err) => console.error(err))
                })
                .catch((e) => {
                  console.log("fail to fetch from pinata", e)
                })
            } else {
      
               getWalletAddress()
              .then((accounts) => {
                  console.log("accounts:", walletAddr)
                  let newRecord = {
                    data: {
                      fileList: [resFile?.data?.IpfsHash],
                      accessList: [walletAddr],
                      timestamp: new Date().toISOString(),
                    },
                  }
                  setRecordTableHash(newRecord)
                  return newRecord
              }).
              then((newRecord) => {
                return  JSON.stringify(newRecord)
              })
              .then((newRecordTable) => {

                console.log("new record:", newRecordTable)
                const options = {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNmE3N2FhNy04NDI2LTQ1OTAtYWJlYS1mNzA1ZjIyNmVhZjkiLCJlbWFpbCI6ImJ1enpsaWdodDY5NDIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MDQ3YmRmMDE2NTdkZGU0NjdjZSIsInNjb3BlZEtleVNlY3JldCI6ImVlOWFiYjI5NGU4NDE5YTMyNTQ5ZWJhNDYwODA1OGFhOTNjYmUxNGMyMmZjNmI1MzJhMWJiNDEzZTA2MWM3MTgiLCJpYXQiOjE3MTAxOTIxOTF9.QUArqSEjo8zxqGGVL-aw1LlLRY2RmBQ2FRvFfjSNw_E`,
                    "Content-Type": "application/json",
                  },
                  body: `{"pinataContent":{"Record": ${newRecordTable}},"pinataMetadata":{"name": "${walletAddr}" } }`,
                }
                let updatedHash
                fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", options)
                  .then((response) => response.json())
                  .then((response) => {
                    updatedHash = response.IpfsHash
                    console.log("updated record Table ", response)
                    const storeBlock = updatePatientIpfs(updatedHash)
                    console.log("storeBlock:", storeBlock)
                  })
                  .catch((err) => console.error(err))
            })
            
          }})
          .catch((e) => {
            console.log("fail to fetch from pinata", e)
          })
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
      )
      const file = await fileRes.blob()
      // We recreated the litNodeClient and the authSig
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "cayenne",
      })
      await litNodeClient.connect()
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
        nonce: "abcdefghijkl",
      })
      // Then we simpyl extract the file and metadata from the zip
      // We could do more with this, like try to display it in the app UI if we wanted to
      const { decryptedFile, metadata } =
        await LitJsSdk.decryptZipFileWithMetadata({
          file: file,
          litNodeClient: litNodeClient,
          authSig: authSig,
        })
      // After we have our dcypted file we can download it
      const blob = new Blob([decryptedFile], {
        type: "application/octet-stream",
      })
      const downloadLink = document.createElement("a")
      downloadLink.href = URL.createObjectURL(blob)
      downloadLink.download = metadata.name
      downloadLink.click() // Use the metadata to get the file name and type
    } catch (error) {
      alert("Trouble decrypting file")
      console.error(error)
    }
  }

  return (
    <div className="w-full rounded shadow-2xl bg-white p-4 ring-1 ring-gray-200">
      <h1 className="text-2xl font-bold">File Upload</h1>
      <form onSubmit={sendFileToIPFS} className={styles.form}>
        <div className={styles.textArea}>
          <textarea
            name="description"
            id="description"
            className={styles.textarea}
            cols={50}
            rows={5}
            placeholder="Describe the uploaded files"
          ></textarea>
        </div>

        <div className={styles.upload_section}>
          <input
            type="file"
            name="file"
            id="file"
            className={`${styles.fileInput}`}
            onChange={(e) => setFileImg(e.target.files[0])}
            
          />
          
          <input
            type="submit"
            value="Submit"
            className="bg-blue-400 px-2 py-1 rounded-md shadow text-white m-1"
          />
        </div>
      </form>
      <div>
        <input type="text" onChange={(e) => setDecryptionCid(e.target.value)} className="bg-white rounded shadow-md mt-2 text-black p-1  ring-1 ring-gray-200 outline-gray-700 focus:outline-blue-700"/>
        <button
          onClick={() => decryptFile(decryptionCid)}
          className="bg-blue-400 px-2 py-1 rounded-md shadow text-white m-1"
        >
          Decrypt
        </button>
      </div>
    </div>
  )
}

export default FileUpload
