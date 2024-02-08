"use client";
import {SignIn} from "@clerk/nextjs"
 
function SigninPage() {
 
  return (
        <div style={{width:"100vw", margin:"0 auto" , display:"flex" , justifyContent:"center", marginTop:"2.5rem"  }}>
          <SignIn/>
        </div>
    )
}

export default SigninPage