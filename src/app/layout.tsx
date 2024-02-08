import Navbar from "@/components/NavBar"
import { ClerkProvider } from '@clerk/nextjs'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  
  return (
        <ClerkProvider>
          <html lang="en">
            <body style={{margin:"0" ,padding:"0"}}>
                  <Navbar />
                  {children}
            </body>
          </html>
        </ClerkProvider>
  )
}
