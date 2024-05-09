import "../globals.css"
import { Inter as FontSans } from "next/font/google"

import Sidebar from "@/components/Sidebar"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }:{children: React.ReactNode}) {
  return (
      <main className="min-h-screen grid grid-cols-12 justify-center items-center ">
        <section className="col-span-3 px-5 py-2 bg-slate-50 h-full">
            <Sidebar />
        </section>
        <section className="col-span-9 px-5 py-2 bg-white h-full">
           {children}
        </section>
      </main>
  
  )
}