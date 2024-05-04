"use client";
import React from "react"
import { getIpfsCID } from "@/lib/contract_api"

const uploadedFiles = () => {
  let  ipfsHash = ""

  const getIpfsFetch = async () => {
    try{
      
      ipfsHash = await getIpfsCID()
      console.log(ipfsHash)
    }catch(err){
      console.log(err)
    }
  }



  

  return (

    <div className="">
      <div className="flex wrap justify-center align-middle ">
        <button onClick={getIpfsFetch}>Get IPFS CID</button>
      </div>
    </div>
  )
}

export default uploadedFiles
