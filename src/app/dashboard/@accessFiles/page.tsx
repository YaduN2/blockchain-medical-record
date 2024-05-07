"use client"
import Link from "next/link"
import React, { useState } from "react"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as LitJsSdk from "@lit-protocol/lit-node-client"

const accessFiles = () => {
  let ipfsHash = ""
  let [record, setRecord] = useState([])
  let [addr, setAddr] = useState("")

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        console.log("Connected to Metamask", accounts)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const fetchRecords = async () => {
    try {
      let urlFileList = `https://api.pinata.cloud/data/pinList?metadata[name]=${addr}`

      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNmE3N2FhNy04NDI2LTQ1OTAtYWJlYS1mNzA1ZjIyNmVhZjkiLCJlbWFpbCI6ImJ1enpsaWdodDY5NDIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MDQ3YmRmMDE2NTdkZGU0NjdjZSIsInNjb3BlZEtleVNlY3JldCI6ImVlOWFiYjI5NGU4NDE5YTMyNTQ5ZWJhNDYwODA1OGFhOTNjYmUxNGMyMmZjNmI1MzJhMWJiNDEzZTA2MWM3MTgiLCJpYXQiOjE3MTAxOTIxOTF9.QUArqSEjo8zxqGGVL-aw1LlLRY2RmBQ2FRvFfjSNw_E`,
          "Content-Type": "application/json",
        },
      }

      fetch(urlFileList, options)
        .then((response) => response.json())
        .then((response) => {
          console.log(response)
          if (response.count == 0) {
            toast.error("No files found")
            setRecord([])
            toast.error("No files found")
            return
          } else {
            return response.rows[0].ipfs_pin_hash
          }
        })
        .then((ipfsHash) => {
          console.log(ipfsHash)
          if (ipfsHash) {
            if (ipfsHash) {
              let ipfsUrl = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`
              fetch(ipfsUrl)  
                .then((res) => {
                  console.log(res)
                  return res.json()
                })
                .then((res) => {
                  setRecord(res.Record.data.fileList)
                })
                .catch((e) => {
                  console.log("fail to fetch from pinata", e)
                })
            }
          }
        })
        .catch((err) => {
          console.error("failed to load from pinata", err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  function handleForm(e) {
    e.preventDefault()
    connectToMetamask()
    fetchRecords()
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
    <div className="w-full">
      <div className="shadow-md rounded-md bg-white ring-1 ring-gray-200">
        <h1 className="font-bold text-center m2 text-2xl">Access Files</h1>
        <form className="p-4" onSubmit={handleForm}>
          <label htmlFor="addr">Address:</label>
          <input
            type="text"
            id="addr"
            name="addr"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={addr}
            onChange={(e) => setAddr(e.target.value.trim())}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md mt-2"
          >
            Access Files
          </button>
        </form>

        <div className="m-4">
          {record.length>0 && (<h1 className="font-bold   text-2xl">Uploaded Files</h1>)}
          <ul className="text-gray-600 mt-5">
            {record?.map((item, idx) => {
              return (
                <li key={idx} className="text-xs">
                  <button onClick={() => decryptFile(item)}>
                    File {idx + 1}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default accessFiles
