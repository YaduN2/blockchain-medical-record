"use client"
import React, { useState, useEffect } from "react"
import { getIpfsCID, updatePatientIpfs } from "@/lib/contract_api"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"

function Appointments() {
  let [reciever, setReciever] = useState("")
  let [records, setRecords] = useState({ data: { accessList: [],fileList:[], timestamp:"" } })
  
  const [walletAddr, setWalletAddr] = useState();


  const getWalletAddress = async () => {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    }).then(res=>{
      setWalletAddr(res[0]);
    })
    return account
  }


  const fetchRecords = async () => {
    try {
      let ipfsHash = await getIpfsCID()
      let ipfsUrl = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`
      fetch(ipfsUrl)
        .then((res) => {
          if (
            !res.ok ||
            res.headers.get("content-type") !== "application/json"
          ) {
            throw new Error("Network response was not ok or not JSON")
          }
          return res.json()
        })
        .then((res) => {
          console.log(res.Record)
          setRecords(res.Record)
        })
        .catch((err) => {
          console.error(err)
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRecords()
    getWalletAddress();
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!reciever) {
      toast.error("Improper Input");
      return;
    }
  
    if (records.data?.accessList.some((item) => item === reciever)) {
      toast.error("Receiver already exists");
      return;
    }

    // only owner can provide access
    if(walletAddr !== records.data.accessList[0]){
      toast.error("Only owner can provide access");
      return;
    }
  
    let newAccessList = [...records.data.accessList, reciever];
    let newRecords = {
      data: {
        fileList: [...records.data.fileList],
        accessList: newAccessList,
        timestamp: new Date().toISOString(),
      },
    };
  
    setRecords(newRecords);
  
    console.log("New records:", newRecords);  
  
    try {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNmE3N2FhNy04NDI2LTQ1OTAtYWJlYS1mNzA1ZjIyNmVhZjkiLCJlbWFpbCI6ImJ1enpsaWdodDY5NDIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MDQ3YmRmMDE2NTdkZGU0NjdjZSIsInNjb3BlZEtleVNlY3JldCI6ImVlOWFiYjI5NGU4NDE5YTMyNTQ5ZWJhNDYwODA1OGFhOTNjYmUxNGMyMmZjNmI1MzJhMWJiNDEzZTA2MWM3MTgiLCJpYXQiOjE3MTAxOTIxOTF9.QUArqSEjo8zxqGGVL-aw1LlLRY2RmBQ2FRvFfjSNw_E`,
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ pinataContent: { Record: newRecords } }),
        body: `{"pinataContent":{"Record": ${JSON.stringify(newRecords)}},"pinataMetadata":{"name": "${walletAddr}" } }`,
      };
  
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", options);
      const data = await response.json();
      const ipfsHash = data.IpfsHash;
  
      await updatePatientIpfs(ipfsHash);
      toast.success("Access provided");
  
      // Fetch records after successful update
      fetchRecords();
    } catch (error) {
      console.error("Error:", error);
    }
    setReciever("");

  };
  
  const handleRevoke = async (e) => {

    e.preventDefault();
  
    if (!reciever) {
      toast.error("Improper Input");
      return;
    }
  
    if(reciever== records.data.accessList[0]){
      toast.error("Cannot revoke access for the owner");
      return;
    }
 
    if (!records.data?.accessList.some((item) => item === reciever)) {
      toast.error("Receiver does not exist");
      return;
    }

    // only owner can revoke access

    if(walletAddr !== records.data.accessList[0]){
      toast.error("Only owner can revoke access");
      return;
    }

  
    let newAccessList = records.data.accessList.filter((item) => item !== reciever);
    let newRecords = {
      data: {
        fileList: [...records.data.fileList],
        accessList: newAccessList,
        timestamp: new Date().toISOString(),
      },
    };


  
    setRecords(newRecords);
  
    console.log("New records:", newRecords);  
  
    try {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNmE3N2FhNy04NDI2LTQ1OTAtYWJlYS1mNzA1ZjIyNmVhZjkiLCJlbWFpbCI6ImJ1enpsaWdodDY5NDIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MDQ3YmRmMDE2NTdkZGU0NjdjZSIsInNjb3BlZEtleVNlY3JldCI6ImVlOWFiYjI5NGU4NDE5YTMyNTQ5ZWJhNDYwODA1OGFhOTNjYmUxNGMyMmZjNmI1MzJhMWJiNDEzZTA2MWM3MTgiLCJpYXQiOjE3MTAxOTIxOTF9.QUArqSEjo8zxqGGVL-aw1LlLRY2RmBQ2FRvFfjSNw_E`,
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ pinataContent: { Record: newRecords } }),
        body: `{"pinataContent":{"Record": ${JSON.stringify(newRecords)}},"pinataMetadata":{"name": "${walletAddr}" } }`,
      };
  
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", options);
      const data = await response.json();
      const ipfsHash = data.IpfsHash;
  
      await updatePatientIpfs(ipfsHash);
      toast.success("Access Revoked");
  
      // Fetch records after successful update
      fetchRecords();
    } catch (error) {
      console.error("Error:", error);
    }
    setReciever("");
  }

  
  return (
    <div className="w-full">
      <div className="flex flex-col bg-white rounded-lg shadow-lg ring-1 ring-gray-200 p-2 ">
        <h1 className="font-bold text-2xl mt-2">Give Access</h1>
        <form   className="m-4">
          <label htmlFor="reciever"></label>
          <input
            onChange={(e) => {
              setReciever(e.target.value.trim())
            }}
            value={reciever}
            type="text"
            name="reciever"
            className="border-2 border-gray-300 p-2 rounded-lg focus:ring-blue-500 w-5/12"
          />
          <button
            className="bg-blue-400 rounded shadow px-2 py-1 text-white font-bold m-1 ms-2"
            type="button"
            onClick={handleSubmit}
          >
            Give Access
          </button>
          <button
            className="bg-red-400 rounded shadow px-2 py-1 text-white font-bold m-1"
            type="submit"
            onClick={handleRevoke}
          >
            Revoke Access
          </button>
        </form>
        <div>
          <h1 className="text-md m-1 text-semibold">Access List: </h1>
            <ul className="ms-3">
              {records.data?.accessList.map((item, idx) => (
                <li key={idx}>{idx+1 +".   "+ item}</li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Appointments
