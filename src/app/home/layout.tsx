import "../globals.css"

import Sidebar from "@/components/Sidebar"



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-full w-screen grid sm:grid-cols-12 grid-rows-12 justify-center items-center">
      <section className="sm:col-span-2 row-span-1 sm:px-5 px-0 py-2 bg-slate-50 h-full">

        {/* This component handles creating file and folder functionality as well as signing out */}
        <Sidebar />
      </section>
      <section className="sm:col-span-10 row-span-11 sm:px-5 px-0 py-2 bg-white h-full overflow-y-auto">
        {children}
      </section>
    </main>

  )
}
