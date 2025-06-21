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
import { useAuth } from "@/lib/hooks/useAuth"

const navigation = [
  {
    name: "My Elections",
    href: "/dashboard/my-elections",
    icon: VoteIcon,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
]

export default function VoterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()

  // Helper for initials
  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const first = parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const second = parts[1][0] ? parts[1][0].toUpperCase() : "?";
    return first + second;
  }

  const handleLogout = () => {
    // Add logout logic here
    router.push("/login")
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
                {authLoading ? "--" : getInitials((user?.firstName || "") + " " + (user?.lastName || ""))}
              </div>
              {!isCollapsed && (
                <div>
                  {authLoading ? (
                    <div className="h-4 w-24 bg-white/20 rounded animate-pulse mb-1" />
                  ) : (
                    <p className="font-medium text-white">{(user?.firstName || "") + (user?.lastName ? " " + user.lastName : "") || "-"}</p>
                  )}
                  <p className="text-sm text-white/70">{user?.studentId || user?.email || "Student"}</p>
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
                    onClick={() => router.push(item.href)}
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

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-4 border-t border-white/10 flex items-center justify-center text-white/70 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

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
          {children}
        </main>
      </div>
    </div>
  )
} 