"use client"
import React, { useState } from "react"
import { getIpfsCID } from "@/lib/contract_api"
import { ListItem } from "@mui/material"

const uploadedFiles = () => {
  let ipfsHash = ""
  let [viewFiles, setViewFiles] = useState(false)
  let record

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
      ipfsHash = await getIpfsCID()
      console.log("console from uploadedFile preview section ",ipfsHash)
      let ipfsUrl = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`
      fetch(ipfsUrl)
        .then((res) => res.json())
        .then((res) => {
          record = res
        })
        .catch((e) => {
          console.error("fail to fetch from pinata", e)
        })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="">
      <div className="flex wrap justify-center align-middle ">
        {!viewFiles && (
          <button
            className="bg-gray-600 text-white rounded-lg shadow-md px-2 py-1"
            onClick={fetchRecords}
          >
            Get IPFS CID
          </button>
        )}
        {viewFiles && (
          <ul>
            {record?.data?.fileList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default uploadedFiles
