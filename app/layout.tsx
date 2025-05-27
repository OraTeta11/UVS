"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const hideHeader = pathname === '/dashboard' || pathname === '/admin/dashboard' || pathname === '/elections' || pathname === '/my-elections' || pathname === '/profile'

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            {!hideHeader && <Header />}
            {/* Spacer to account for fixed header height */}
            {!hideHeader && <div className="h-10"></div>}
            <main className={`flex-1 bg-white`}>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
