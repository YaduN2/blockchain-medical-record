"use client";

import Navbar from "@/components/NavBar"
import AppContextProvider from "@/context/appcontext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  
  return (
    <html lang="en">
      <body style={{margin:"0" ,padding:"0"}}>
        <AppContextProvider>
          <Navbar />
          {children}
        </AppContextProvider>
      </body>
    </html>
  )
}
