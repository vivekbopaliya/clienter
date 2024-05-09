import "./globals.css"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import QueryProvider from "@/lib/provider"
import { Toaster } from "react-hot-toast"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <head />
      <body
        className={cn(
          "min-h-screen bg-[#efefef] tracking-tighter font-sans antialiased",
          fontSans.variable
        )}
      >
        <Toaster />
        <QueryProvider>
          <main className="w-full h-screen ">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  )
}
