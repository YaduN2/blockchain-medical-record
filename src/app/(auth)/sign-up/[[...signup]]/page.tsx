import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div   style={{width:"100vw", margin:"0 auto" , display:"flex" , justifyContent:"center", marginTop:"2.5rem"  }}>
        <SignUp afterSignInUrl="/register" />
    </div>  
  )
}