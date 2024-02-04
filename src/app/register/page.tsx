import React from "react";
import Link from "next/link";
import Patient from "../patient/page";

const Register = () => {
  return (
    <>
      <Link href="/register/patient">Patient    </Link>
      <Link href="/register/doctor">Doctor</Link>
    </>
  );
};

export default Register;
