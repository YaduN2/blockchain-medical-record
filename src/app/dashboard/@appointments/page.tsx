"use client"
import React, { useState, useEffect } from "react"
import { getIpfsCID, updatePatientIpfs } from "@/lib/contract_api"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"

function Appointments() {
  let [reciever, setReciever] = useState("")
  let [records, setRecords] = useState({ data: { accessList: [] } })

const fetchRecords = async () => {
  // try {
  //   let ipfsHash = await getIpfsCID()
  //   console.log(ipfsHash)
  //   let ipfsUrl = `https://sapphire-abundant-dingo-915.mypinata.cloud/ipfs/${ipfsHash}`
  //   fetch(ipfsUrl)
  //     .then((res) => {
  //       if (!res.ok || res.headers.get('content-type') !== 'application/json') {
  //         throw new Error("Network response was not ok or not JSON")
  //       }
  //       return res.json()
  //     })
  //     .then((res) => {
  //       setRecords(res)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //     })
  // } catch (err) {
  //   console.error(err)
  // }
}

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reciever) {
      toast.error("improper Input")
      return
    }

    if (records.data?.accessList.some((item) => item === reciever)) {
      toast.error("already exists")
    }

    records.data.accessList = [...records.data.accessList, reciever]

    await updatePatientIpfs(JSON.stringify(records))
    toast.success("Access provided")
    fetchRecords()
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-2 h-36">
      <form onSubmit={handleSubmit} className="m-2">
        <label htmlFor="reciever"></label>
        <input
          onChange={(e) => {
            setReciever(e.target.value)
          }}
          value={reciever}
          type="text"
          name="reciever"
          className="border-2 border-gray-300 p-2 rounded-lg focus:ring-blue-500"
        />
        <button className="bg-blue-400 rounded shadow px-2 py-1 text-white font-bold m-2" type="submit">Give Access</button>
      </form>

      <ul>
        {records.data?.accessList.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default Appointments
