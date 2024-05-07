"use client"
import React, { useEffect, useState } from "react"
import { getIpfsCID } from "@/lib/contract_api"
import Link from "next/link"
import * as LitJsSdk from "@lit-protocol/lit-node-client"

const uploadedFiles = () => {
  let ipfsHash = ""
  let [record, setRecord] = useState([])

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
      await connectToMetamask()
      let ipfsHash = await getIpfsCID()
        .then((res) => {
          return res
        })
        .then((ipfsHash) => {
          if (ipfsHash) {
            let ipfsUrl = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`
            fetch(ipfsUrl)
              .then((res) => res.json())
              .then((res) => {
                setRecord(res.Record.data.fileList)
              })
              .catch((e) => {
                console.log("fail to fetch from pinata", e)
              })
          }
        })
    } catch (err) {
      console.log(err)
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

  useEffect(() => {
    fetchRecords()
    connectToMetamask()
  }, [])

  return (
    <div className="w-full">
      <div className="rounded-md shadow-md m-2 p-2 ring-1 ring-gray-200 min-h-96">
        <h1 className="font-bold   text-2xl">Uploaded Files</h1>
        {
          <ul className="text-gray-600 mt-5 ms-4">
            {record?.map((item, idx) => {
              console.log("asdasd")
              return (
                <li key={idx} className="text-md font-semibold ">
                  <button
                    className=""
                    onClick={() => decryptFile(item)}
                  >
                    {idx + 1} File 
                  </button>
                </li>
              )
            })}
          </ul>
        }
      </div>
    </div>
  )
}

export default uploadedFiles
