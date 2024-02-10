"use client";
import {SignIn} from "@clerk/nextjs"
import { revalidatePath } from "next/cache";
 
function SigninPage() {
  return (
        <div   style={{width:"100vw", margin:"0 auto" , display:"flex" , justifyContent:"center", marginTop:"2.5rem"  }}>
          <SignIn afterSignInUrl="/dashboard"   />
          
        </div>
    )
}


export default SigninPage