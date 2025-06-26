"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, ChevronDown, Home, LogOut, Menu, Settings, Shield, Users, VoteIcon, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from '@/context/NotificationContext';

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { notifications, markAllAsRead, clearNotifications, unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBellClick = () => {
    setShowDropdown((v) => !v);
    if (!showDropdown) markAllAsRead();
  };

  return (
    <div className="bg-[#003B71] text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center">
              <Shield className="h-8 w-8 mr-2" />
              <span className="font-semibold text-lg hidden md:inline-block">UR Admin Portal</span>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-[#002a52]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/admin/dashboard" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md">
              <Home className="h-4 w-4 inline-block mr-1" />
              Dashboard
            </Link>
            <Link href="/admin/elections" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md">
              <VoteIcon className="h-4 w-4 inline-block mr-1" />
              Elections
            </Link>
            <Link href="/admin/candidates" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md">
              <Users className="h-4 w-4 inline-block mr-1" />
              Candidates
            </Link>
            <Link href="/admin/voters" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md">
              <Users className="h-4 w-4 inline-block mr-1" />
              Voters
            </Link>
            <Link href="/admin/reports" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md">
              <BarChart3 className="h-4 w-4 inline-block mr-1" />
              Reports
            </Link>

            {/* Admin Notification Bell */}
            <div className="relative flex items-center">
              <Button variant="ghost" className="p-2 text-white hover:bg-[#002a52] relative" onClick={handleBellClick} aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center h-5 w-5">
                    <span className="block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">{unreadCount}</span>
                  </span>
                )}
              </Button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b font-semibold text-[#003B71]">
                    <span>Notifications</span>
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline" onClick={markAllAsRead}>Mark all as read</button>
                      <button className="text-xs text-red-600 hover:underline" onClick={clearNotifications}>Clear all</button>
                    </div>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-gray-500 text-sm">No notifications</div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {notifications.map((n, i) => (
                        <li key={i} className={`p-4 text-sm ${n.read ? 'text-gray-400' : 'font-semibold text-black'}`}>
                          <span className="font-medium">{n.type ? `[${n.type}] ` : ''}</span>{n.message}
                          <span className="block text-xs text-gray-400 mt-1">{n.timestamp ? new Date(n.timestamp).toLocaleString() : ''}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-white hover:bg-[#002a52]">
                  <span className="mr-1">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/admin/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout" className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#002a52] border-t border-[#001f3d]">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/admin/dashboard"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 inline-block mr-2" />
                Dashboard
              </Link>
              <Link
                href="/admin/elections"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <VoteIcon className="h-4 w-4 inline-block mr-2" />
                Elections
              </Link>
              <Link
                href="/admin/candidates"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4 inline-block mr-2" />
                Candidates
              </Link>
              <Link
                href="/admin/voters"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4 inline-block mr-2" />
                Voters
              </Link>
              <Link
                href="/admin/reports"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4 inline-block mr-2" />
                Reports
              </Link>
              <Link
                href="/admin/settings"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 inline-block mr-2" />
                Settings
              </Link>
              <Link
                href="/logout"
                className="px-3 py-2 text-white hover:bg-[#003B71] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="h-4 w-4 inline-block mr-2" />
                Log out
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="bg-[#002a52] border-t border-[#001f3d]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-blue-100 mt-1">{description}</p>}
        </div>
      </div>
    </div>
  )
}
