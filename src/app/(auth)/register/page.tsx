"use client"
import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import styles from "@/styles/login.module.css"
import { connect } from "http2"


const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const router = useRouter()
  const [hbd, setHbd] = useState("")
  const [role, setRole] = useState("")
  const [allergy, setAllergy] = useState("")
  const [blood, setBlood] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [recent, setRecent] = useState("")
  const [addresses, setAddresses] = useState("")
  const [phone, setPhone] = useState("")
  const [metamask, setMetamask] = useState("")
  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        phoneNumber : phone,
      })

      

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // change the UI to our pending section.
      setPendingVerification(true)
    } catch (err) {
      console.error(err)
    }
  }

  // Verify User Email Code
  const onPressVerify = async (e) => {
    e.preventDefault()
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2))
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push("/")
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Connect to Metamask
  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setMetamask(accounts[0])
        console.log(accounts[0])
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className={styles.container}>
      {!pendingVerification && (
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
                  onChange={(e) => setFirstName(e.target.value)}
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
                  onChange={(e) => setLastName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="name@company.com"
                  required={true}
                />
              </div>
              <div>
                <label htmlFor="password" className={styles.input_label}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
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
                    onChange={(e) => setHeight(e.target.value)}
                    className={styles.input}
                    required={true}
                  />
                </div>
                <div>
                  <label htmlFor="addresses" className={styles.input_label}>
                    Addresses
                  </label>
                  <input
                    type="text"
                    name="addresses"
                    id="addresses"
                    onChange={(e) => setAddresses(e.target.value)}
                    className={styles.input}
                    required={true}
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
                    onChange={(e) => setPhone(e.target.value)}
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
                    onChange={(e) => setWeight(e.target.value)}
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
                    onChange={(e) => setHbd(e.target.value)}
                    className={styles.input}
                    required={true}
                  />
                </div>
   

              <div>
                <label htmlFor="role" className={styles.input_label}>
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  onChange={(e) => setRole(e.target.value)}
                  className={styles.input}
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
                  onChange={(e) => setAllergy(e.target.value)}
                  className={styles.input}
                  required={true}
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
                  onChange={(e) => setBlood(e.target.value)}
                  className={styles.input}
                  required={true}
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
                  onChange={(e) => setRecent(e.target.value)}
                  className={styles.textarea}
                  rows={4}
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
      {pendingVerification && (
        <div>
          <form className={styles.form}>
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
      )}
    </div>
  )
}

export default Register
