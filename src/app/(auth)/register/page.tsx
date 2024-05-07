"use client"
import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import styles from "@/styles/login.module.css"
import { connect } from "http2"
import Alert from "@mui/material/Alert"
import { red } from "@mui/material/colors"
import {registerPatient , registerDoctor} from "@/lib/contract_api"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




type Ipatient = {
  username: string
  firstname: string
  lastname: string
  email: string
  phone: string
  height: string
  address: string
  weight: string
  hbd: Date
  allergy: string
  blood: string
  recent: string
  metamask: string
}

type Idoctor = {
  username: string
  firstname: string
  lastname: string
  email: string
  phone: string
  specialization: string
}

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const router = useRouter()
  const [hbd, setHbd] = useState("")
  const [error, setError] = useState("")
  const [ipfsHash , setIpfsHash] = useState("")

  const [user, setUser] = useState<Iuser | null>(null)

  // Form Submit
  const handleSubmit = async (e) => {
 
    e.preventDefault()
    if(user.metamask == null){
      alert("Please authenticate using metamask")
      return
    }

      let data  ;

      if(user.role == "doctor"){
        data = {
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          specialization: user.specialization,
        }
      }else{
        
          
            data = {
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              phone: user.phone,
              height: user.height,
              address: user.address,
              weight: user.weight,
              hbd: user.hbd,
              allergy: user.allergy,
              blood: user.blood,
              recent: user.recent,
              metamask: user.metamask
            }
      }

      
      


      try{

        //1. storing to IPFS
          // const token = process.env.PINATA_JWT
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZjI0ZTFhZC0wZGJhLTQ0OTEtOTI4My02YzMwODAxMWIyZDEiLCJlbWFpbCI6InJpcm9tYTM5MzZAaGRybG9nLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5MWRiMzM5NzI0ZDIxNDBiYWEzMiIsInNjb3BlZEtleVNlY3JldCI6ImQ4NTFlY2RjZWU2ZmVjY2RhZjYwNWM2OGU0MTk4NzRhODRlZjM4OTRjYzQ4ZmJiOTlkNThhM2FiNDI3ZjQ3ZDkiLCJpYXQiOjE3MTAxODYxNTJ9.i_3z6yOLn89MOxdcP_HChOwbrDLLskXmvQHSdPXrzAE"
          const options = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({pinataMetadata: {name: 'User Data'}, pinataContent: data})
          };
          
          fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
            .then(response => response.json())
            .then(response => {
              console.log(response);
              setIpfsHash(response.IpfsHash)
            }).then(()=>{
                //2.Storing to blockchain
                if(user?.role == "doctor"){
                  registerDoctor(data.firstname, data.specialization)
                }else{
                  registerPatient(data.firstname, data.hbd, ipfsHash)
                }
                router.push("/dashboard ")
            })
            .catch(err => console.error(err));

            
        

      
      }catch(err){
        console.error("Error", err)
      }



}
 

  // Connect to Metamask
  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setUser({ ...user, metamask: accounts[0] })
        window.alert("Connected to Metamask successfully!")
        toast.success("Connected to Metamask successfully!"); // Show success toast

      } catch (err) {
        console.error(err)
        toast.error("Failed to connect to Metamask."); // Show error toast

      }
    }
  }

  return (
    <div className={styles.container}>
      { (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.h1}>Register</h1>
            <div className={styles.grid}>


              <div>
                  <label htmlFor="role" className={styles.input_label}>
                    Role
                  </label>
                  <select
                    name="role"
                    id="role"
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    className={styles.input}
                    value={user?.role}
                    required={true}
                  >
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
              </div>

              {user?.role === "doctor" && (
                <>
                 <div>
                  <label htmlFor="first_name" className={styles.input_label}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={user?.firstname}
                    onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                    className={styles.input}
                    required={true} />
                </div>
                <div>
                    <label htmlFor="last_name" className={styles.input_label}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={user?.lastname}
                      onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                      className={styles.input}
                      required={true} />
                  </div>
                  <div>
                    <label htmlFor="email" className={styles.input_label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user?.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className={styles.input}
                      placeholder="name@company.com"
                      required={true} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={styles.input_label}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={user?.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className={styles.input}
                      required={true} />
                  </div>
                    <div>
                      <label htmlFor="specialization" className={styles.input_label}>
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        id="specialization"
                        value={user?.specialization}
                        onChange={(e) => setUser({ ...user, specialization: e.target.value })}
                        className={styles.input}
                        required={true} />
                    </div>
       

                      <div className="w-full col-span-2">
                            <button
                              type="button"
                              className="w-full bg-[#333333] font-semibold text-white p-4 rounded-md shadow"
                              onClick={connectToMetamask}
                            >
                              Authenticate using Metamask
                            </button>
                      </div>



                    </>
              )
              }
  
              {user?.role === "patient" && (
                      <>
                      <div>
                        <label htmlFor="first_name" className={styles.input_label}>
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value={user?.firstname}
                          onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                          className={styles.input}
                          required={true} />
                      </div>
                      
                      <div>
                        <label htmlFor="last_name" className={styles.input_label}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={user?.lastname}
                          onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                          className={styles.input}
                          required={true} />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className={styles.input_label}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={user?.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className={styles.input}
                          placeholder="name@company.com"
                          required={true} />
                      </div>

                      

                      <div className={styles.grpItem}>
                        <label htmlFor="height" className={styles.input_label}>
                          height
                        </label>
                        <input
                          type="number"
                          name="height"
                          id="height"
                          value={user?.height}
                          onChange={(e) => setUser({ ...user, height: e.target.value })}
                          className={styles.input}
                          required={true} />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className={styles.input_label}>
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={user?.address}
                          onChange={(e) => setUser({ ...user, address: e.target.value })}
                          className={styles.input} />
                      </div>
                   
                      <div>
                        <label htmlFor="phone" className={styles.input_label}>
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={user?.phone}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                          className={styles.input}
                          required={true} />
                      </div>
                      
                      <div className={styles.grpItem}>
                        <label htmlFor="weight" className={styles.input_label}>
                          weight
                        </label>
                        <input
                          type="number"
                          name="weight"
                          id="weight"
                          value={user?.weight}
                          onChange={(e) => setUser({ ...user, weight: e.target.value })}
                          className={styles.input}
                          required={true} />
                      </div>
                      
                      <div className={styles.grpItem}>
                        <label htmlFor="hbd" className={styles.input_label}>
                          Birth Date
                        </label>
                        <input
                          type="date"
                          name="hbd"
                          id="hbd"
                          value={user?.hbd ? new Date(user.hbd * 1000).toISOString().split('T')[0] : ''}                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            const timestamp = Math.floor(date.getTime() / 1000);
                            setUser({ ...user, hbd: timestamp });
                          }}
                          className={styles.input} />
                      </div>

                      <div>
                        <label htmlFor="allergy" className={styles.input_label}>
                          Allergy
                        </label>
                        <input
                          type="text"
                          name="allergy"
                          id="allergy"
                          value={user?.allergy}
                          onChange={(e) => setUser({ ...user, allergy: e.target.value })}
                          className={styles.input} />
                      </div>

                      ,

                      <div>
                        <label htmlFor="blood" className={styles.input_label}>
                          Blood Group
                        </label>
                        <input
                          type="text"
                          name="blood"
                          id="blood"
                          onChange={(e) => setUser({ ...user, blood: e.target.value })}
                          className={styles.input}
                          required={true}
                          placeholder="AB+"
                          value={user?.blood} />
                      </div>

                      

                      <div className={styles.text_container}>
                        <label htmlFor="recent" className={styles.input_label}>
                          Remarks
                        </label>
                        <textarea
                          name="recent"
                          id="recent"
                          placeholder="recent health condition..."
                          onChange={(e) => setUser({ ...user, recent: e.target.value })}
                          className={styles.textarea}
                          rows={4}
                          value={user?.recent} />
                      </div>

                      <div className="w-full col-span-2">
                            <button
                              type="button"
                              className="w-full bg-[#333333] font-semibold text-white p-4 rounded-md shadow"
                              onClick={connectToMetamask}
                            >
                              Authenticate using Metamask
                            </button>
                      </div>

                  </>

        )}
                
            </div>

            <button type="submit" className={styles.btn_submit}>
              Sign Up
            </button>
        </form>
      )}
    </div>
  )
}

export default Register
