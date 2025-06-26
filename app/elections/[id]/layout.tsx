'use client'

import type React from "react"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { LayoutDashboard, VoteIcon, CircleUser } from "lucide-react"
import Link from "next/link"

export default function ElectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
          <div className="flex flex-col h-full bg-[#003B71] text-white">
            <div className="p-4 border-b border-[#002a52] flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold">Voter Name</p>
                <p className="text-sm text-gray-300">Student ID: 12345</p>
              </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
              <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52]">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard Home</span>
              </Link>
              <Link href="/elections" className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52]">
                <VoteIcon className="mr-2 h-4 w-4" />
                <span>My Elections</span>
              </Link>
              <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-[#002a52]">
                <CircleUser className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </nav>
            <div className="p-4 text-xs text-gray-400 border-t border-[#002a52]">
              <p>Election Period:</p>
              <p>Start: May 10, 2025</p>
              <p>End: May 15, 2025</p>
            </div>
          </div>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
} 