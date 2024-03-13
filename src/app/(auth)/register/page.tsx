"use client"
import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import styles from "@/styles/login.module.css"
import { connect } from "http2"
import Alert from "@mui/material/Alert"
import { red } from "@mui/material/colors"

type Iuser = {
  username: string
  firstname: string
  lastname: string
  email: string
  phone: string
  height: string
  address: string
  weight: string
  hbd: Date
  role: string
  allergy: string
  blood: string
  recent: string
  metamask: string
}

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const router = useRouter()
  const [hbd, setHbd] = useState("")
  const [error, setError] = useState("")

  const [user, setUser] = useState<Iuser | null>(null)

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
 
      if(user.metamask == null){
        alert("Please authenticate using metamask")
        return
      }

      
      
          const data = {
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            emailAddress: user.email,
            phoneNumber: user.phone,
            height: user.height,
            address: user.address,
            weight: user.weight,
            hbd: user.hbd,
            role: user.role,
            allergy: user.allergy,
            blood: user.blood,
            recent: user.recent,
            metamask: user.metamask,
          }


          try{

            // TODO: Add the user to the blockchain after encryption
              // fetch("/api/register", {
              //   method: "POST",
              //   headers: {
                //     "Content-Type": "application/json",
              //   },
              //   body: JSON.stringify(data),
              // })
              // .catch((err) => {
              //   setError(err)
              //   console.log("err", err)
              // }).then(()=>{
                // router.push("/dashboard")
              // })

          // change the UI to our pending section.

            
          
          }catch(err){
            console.log("Error", err)
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
        console.log(accounts[0])
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className={styles.container}>
      { (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.h1}>Register</h1>
            <div className={styles.grid}>
              <div>
                <label htmlFor="first_name" className={styles.input_label}>
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value = {user?.firstname}
                  onChange={(e) =>
                    setUser({ ...user, firstname: e.target.value })
                  }
                  className={styles.input}
                  required={true}
                />
              </div>
              <div>
                <label htmlFor="last_name" className={styles.input_label}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value = {user?.lastname}
                  onChange={(e) =>
                    setUser({ ...user, lastname: e.target.value })
                  }
                  className={styles.input}
                  required={true}
                />
              </div>
              <div>
                <label htmlFor="email" className={styles.input_label}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value = {user?.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className={styles.input}
                  placeholder="name@company.com"
                  required={true}
                />
              </div>
   
              <div className={styles.grpItem}>
                <label htmlFor="height" className={styles.input_label}>
                  height
                </label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  value = {user?.height}
                  onChange={(e) => setUser({ ...user, height: e.target.value })}
                  className={styles.input}
                  required={true}
                />
              </div>
              <div>
                <label htmlFor="address" className={styles.input_label}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value = {user?.address}
                  onChange={(e) =>
                    setUser({ ...user, address: e.target.value })
                  }
                  className={styles.input}
                  // required={true}
                />
              </div>
              <div>
                <label htmlFor="phone" className={styles.input_label}>
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value = {user?.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className={styles.input}
                  required={true}
                />
              </div>
              <div className={styles.grpItem}>
                <label htmlFor="weight" className={styles.input_label}>
                  weight
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value = {user?.weight}
                  onChange={(e) => setUser({ ...user, weight: e.target.value })}
                  className={styles.input}
                  required={true}
                />
              </div>
              <div className={styles.grpItem}>
                <label htmlFor="hbd" className={styles.input_label}>
                  Birth Date
                </label>
                <input
                  type="date"
                  name="hbd"
                  id="hbd"
                  value = {user?.hbd}
                  onChange={(e) => setUser({ ...user, hbd: e.target.value })}
                  className={styles.input}
                />
              </div>

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

              <div>
                <label htmlFor="allergy" className={styles.input_label}>
                  Allergy
                </label>
                <input
                  type="text"
                  name="allergy"
                  id="allergy"
                  value = {user?.allergy}
                  onChange={(e) =>
                    setUser({ ...user, allergy: e.target.value })
                  }
                  className={styles.input}
                  // required={true}
                />
              </div>

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
                  value={user?.blood}
                />
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
                  value={user?.recent}
                />
              </div>
            </div>
            <div className="metamask.btn">
              <button
                type="button"
                className={styles.btn_metamask}
                onClick={connectToMetamask}
              >
                Authenticate using Metamask
              </button>
            </div>
            <button type="submit" className={styles.btn_submit}>
              Sign Up
            </button>
          </form>
        </>
      )}
      {/* {pendingVerification && (
        <div>
          <form className={styles.form_email_validation}>
            <input
              value={code}
              className={styles.input}
              placeholder="Enter Verification Code..."
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="submit"
              onClick={onPressVerify}
              className={styles.btn}
            >
              Verify Email
            </button>
          </form>
        </div>
      )} */}
    </div>
  )
}

export default Register
