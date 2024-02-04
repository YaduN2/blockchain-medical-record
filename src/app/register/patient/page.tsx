"use client";
// components/PatientRegistration.js
import { useState } from "react";
import styles from "@/styles/Registration.module.css";

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    metamaskAddress: "",
    dateOfBirth: "",
    // Add more fields as needed
  });

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to handle form submission (e.g., API request)
    console.log("Form submitted:", formData);
  };

  return (
      <div className={styles.container}>
        <h1 className={styles.h1}>Patient Registration</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            First Name
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            MetaMask Address
            <input
              type="metamaskAddress"
              name="metamaskAddress"
              value={formData.metamaskAddress}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>
          {/* Add more form fields as needed */}
          <button type="submit">Register</button>
        </form>
      </div>
  );
};

export default PatientRegistration;
