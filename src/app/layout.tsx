import Navbar from "@/components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./globals.css"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ThirdwebProvider>
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: "0", padding: "0" }} >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
    // </ThirdwebProvider>
  );
}
