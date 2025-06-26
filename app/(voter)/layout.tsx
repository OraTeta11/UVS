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
  LayoutDashboard,
  LucideIcon,
  Bell
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { NotificationProvider, useNotifications } from '@/context/NotificationContext'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: Array<"Student" | "Class Representative" | "Guild Member" | "Dean" | "system_admin">;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Student", "Class Representative", "Guild Member", "Dean"],
  },
  {
    name: "My Elections",
    href: "/dashboard/my-elections",
    icon: VoteIcon,
    roles: ["Student", "Class Representative", "Guild Member", "Dean"],
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: ["Student", "Class Representative", "Guild Member", "Dean"],
  },
]

function NotificationBellPopover() {
  const { notifications } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  return (
    <Popover open={notifOpen} onOpenChange={setNotifOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="font-semibold mb-2">Notifications</div>
        {notifications.length === 0 ? (
          <div className="text-sm text-muted-foreground">No notifications.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
            {notifications.slice(0, 10).map((notif, idx) => (
              <li key={idx} className="py-2">
                <div className="font-medium">{notif.message}</div>
                {notif.type && <div className="text-xs text-gray-500">{notif.type}</div>}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default function VoterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, loading: authLoading } = useAuth()

  // Helper for initials
  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const first = parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const second = parts[1] && parts[1][0] ? parts[1][0].toUpperCase() : "?";
    return first + second;
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Filter navigation based on user role
  const filteredNavigation = user ? navigation.filter(item => item.roles.includes(user.role)) : [];

  return (
    <NotificationProvider>
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
                    <p className="text-sm text-white/70">{user?.studentId || "Voter"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <nav className="p-4 space-y-1">
                {filteredNavigation.map((item) => {
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
          {/* Notification Bell at the top right */}
          <div className="flex justify-end items-center p-4 border-b border-gray-200 bg-white">
            <NotificationBellPopover />
          </div>
          {/* Content Area */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
} 