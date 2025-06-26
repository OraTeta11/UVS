"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Bell, MessageSquare, ChevronDown, LogOut, User, HelpCircle, Home as HomeIcon, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useNotifications } from '@/context/NotificationContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme();
  const { notifications, setNotifications } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = notifications.length;

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="bg-[#003B71] text-white">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/ur-logo.png.jpeg" alt="University of Rwanda" width={50} height={50} className="mr-2" />
                <span className="font-semibold text-lg hidden md:inline-block">University of Rwanda Voting System</span>
              </Link>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-[#002a52]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" /> Home
              </Link>
              <Link href="/help" className="px-3 py-2 text-sm hover:bg-[#002a52] rounded-md flex items-center">
                <HelpCircle className="h-4 w-4 mr-1" /> Help
              </Link>
              <div className="relative flex items-center">
                <Button variant="ghost" className="p-2 text-white hover:bg-[#002a52] relative" onClick={() => setShowDropdown((v) => !v)} aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b font-semibold text-[#003B71]">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {notifications.map((n, i) => (
                          <li key={i} className="p-4 text-sm">
                            <span className="font-medium">{n.type ? `[${n.type}] ` : ''}</span>{n.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center ml-4 space-x-2">
                <Button variant="ghost" className="p-2 text-white hover:bg-[#002a52]" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center text-white hover:bg-[#002a52]">
                      <span className="mr-1">LT</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" /> Help
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/logout" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="px-3 py-2 text-[#003B71] hover:bg-gray-100 rounded-md flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" /> Home
              </Link>
              <Link href="/help" className="px-3 py-2 text-[#003B71] hover:bg-gray-100 rounded-md flex items-center">
                <HelpCircle className="h-4 w-4 mr-1" /> Help
              </Link>
              <Link href="/dashboard/profile" className="px-3 py-2 text-[#003B71] hover:bg-gray-100 rounded-md flex items-center">
                <User className="h-4 w-4 mr-1" /> Profile
              </Link>
              <Button variant="ghost" className="px-3 py-2 text-[#003B71] hover:bg-gray-100 rounded-md flex items-center w-full justify-start" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                {theme === "dark" ? <Sun className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />} {theme === "dark" ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Link href="/logout" className="px-3 py-2 text-[#003B71] hover:bg-gray-100 rounded-md flex items-center">
                <LogOut className="h-4 w-4 mr-1" /> Log out
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
