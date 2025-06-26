"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // Hide header for all dashboard and admin routes
  const hideHeader = pathname?.startsWith('/dashboard') || 
                    pathname?.startsWith('/admin') || 
                    pathname === '/elections' || 
                    pathname === '/my-elections' || 
                    pathname === '/profile'

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <NotificationProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                {!hideHeader && <Header />}
                {/* Spacer to account for fixed header height */}
                {!hideHeader && <div className="h-10"></div>}
                <main className={`flex-1 bg-white`}>
                  {children}
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
