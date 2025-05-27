"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Home,
  VoteIcon,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import MyElections from "./components/my-elections"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "My Elections",
    href: "/my-elections",
    icon: VoteIcon,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export default function VoterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // Add logout logic here
    router.push("/login")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <MyElections />
      case "my-elections":
        return <MyElections />
      case "profile":
        return <div>Profile Content</div>
      default:
        return children
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-[#003B71] text-white flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                JD
              </div>
              {!isCollapsed && (
                <div>
                  <p className="font-medium text-white">John Doe</p>
                  <p className="text-sm text-white/70">Student</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveSection(item.href.split("/")[1] || "dashboard")
                    }}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </button>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-white/70 rounded-md hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
} 