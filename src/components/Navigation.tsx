'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import {
  Home,
  BookOpen,
  Target,
  FileText,
  BarChart3,
  Brain,
  Menu,
  X,
  LogOut,
  User,
  CreditCard,
  ClipboardCheck
} from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      description: 'Overview and quick stats'
    },
    {
      id: 'learning-style',
      name: 'Learning Style',
      icon: <Brain className="w-5 h-5" />,
      description: 'Discover your Kolb learning style'
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Spaced repetition learning'
    },
    {
      id: 'practice',
      name: 'Practice Questions',
      icon: <Target className="w-5 h-5" />,
      description: 'Test your knowledge'
    },
    {
      id: 'materials',
      name: 'Study Materials',
      icon: <FileText className="w-5 h-5" />,
      description: 'Comprehensive resources'
    },
    {
      id: 'progress',
      name: 'Progress',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Track your performance'
    },
    {
      id: 'pricing',
      name: 'Pricing',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Upgrade your plan'
    },
    {
      id: 'submit-results',
      name: 'Results',
      icon: <ClipboardCheck className="w-5 h-5" />,
      description: 'Submit exam results for resit discount'
    }
  ]

  const handleNavigation = (pageId: string) => {
    onPageChange(pageId)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {session.user.image ? (
                    <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <span className="font-medium">{session.user.name || session.user.email}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      {session.user.email}
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/signin' })}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/signin"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2"
              >
                Sign in
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${currentPage === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                <div className="text-left">
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
} 