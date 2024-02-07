"use client";

import Navbar from "@/components/NavBar"
import AppContextProvider from "@/context/appcontext"
import { ClerkProvider } from '@clerk/nextjs'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  
  return (
    <html lang="en">
      <body style={{margin:"0" ,padding:"0"}}>
        <ClerkProvider>
          <AppContextProvider>
            <Navbar />
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
