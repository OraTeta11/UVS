"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  BarChart2,
  Users,
  VoteIcon,
  User,
  Settings,
  Bell,
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { NotificationProvider, useNotifications } from '@/context/NotificationContext'

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ['admin', 'system_admin'],
  },
    {
    name: "Elections",
    href: "/admin/dashboard/elections",
    icon: VoteIcon,
    roles: ['admin', 'system_admin'],
  },
  {
    name: "Analytics",
    href: "/admin/dashboard/analytics",
    icon: BarChart2,
    roles: ['admin', 'system_admin'],
  },
  {
    name: "Voters",
    href: "/admin/dashboard/voters",
    icon: Users,
    roles: ['admin', 'system_admin'],
  },
    {
    name: "Candidates",
    href: "/admin/dashboard/candidates",
    icon: User,
    roles: ['admin', 'system_admin'],
  },
  {
    name: "Admin Requests",
    href: "/admin/dashboard/admin-requests",
    icon: ShieldCheck,
    roles: ['system_admin'],
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [pendingRequests, setPendingRequests] = useState([])
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, loading: authLoading } = useAuth()

  // --- DEBUGGING ---
  console.log("User object in ADMIN layout:", user);
  // -----------------

  // Fetch pending admin requests for system_admin
  useEffect(() => {
    if (user?.role === 'system_admin') {
      const fetchRequests = async () => {
        try {
          const res = await fetch('/api/admin-requests')
          if (!res.ok) throw new Error('Failed to fetch admin requests')
          const data = await res.json()
          setPendingRequests(data)
        } catch (err) {
          setPendingRequests([])
        }
      }
      fetchRequests()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }
  
  // Filter navigation based on user role
  const filteredNavigation = user ? navigation.filter(item => item.roles.includes(user.role)) : [];

  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const first = parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const second = parts[1][0] ? parts[1][0].toUpperCase() : "?";
    return first + second;
  }

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-[#003B71] dark:bg-gray-800 text-white flex flex-col transition-all duration-300",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-700">
            {!isCollapsed && (
               <h1 className="text-xl font-bold">Admin Panel</h1>
            )}
             <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10"
            >
              {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          </div>
          <ScrollArea className="flex-1">
              <nav className="p-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      title={isCollapsed ? item.name : ''}
                      className={cn(
                        "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                        isCollapsed ? "justify-center" : ""
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span className="ml-4">{item.name}</span>}
                    </button>
                  )
                })}
              </nav>
            </ScrollArea>

            <div className="p-4 border-t border-white/10 dark:border-gray-700">
               <button
                onClick={handleLogout}
                title={isCollapsed ? "Logout" : ''}
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-400 rounded-md hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="ml-4">Logout</span>}
              </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">{navigation.find(i => i.href === pathname)?.name || 'Dashboard'}</h2>
              <div className="flex items-center space-x-4">
                  <NotificationBellPopover />
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                        {authLoading ? "--" : getInitials((user?.firstName || "") + " " + (user?.lastName || ""))}
                      </div>
                       <div>
                         {authLoading ? (
                           <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                         ) : (
                           <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{(user?.firstName || "") + (user?.lastName ? " " + user.lastName : "") || "-"}</p>
                         )}
                         <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ') || "Administrator"}</p>
                       </div>
                  </div>
              </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900/50">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
} 