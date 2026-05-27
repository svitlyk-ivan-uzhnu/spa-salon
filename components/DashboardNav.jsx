'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  // Динамічний масив посилань для Spa Oasis
  const links = [
    { href: "/dashboard",          label: "🌿 Огляд" },
    { href: "/dashboard/bookings", label: "📅 Спа-візити" }, 
    { href: "/dashboard/services", label: "💆‍♂️ Процедури" }, 
    ...(isAdmin ? [{ href: "/dashboard/users", label: "👥 Користувачі" }] : []),
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {links.map((link) => {
              // Перевіряємо, чи є посилання активним в даний момент
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "border-emerald-700 text-emerald-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
          
          {/* Поточна роль у кутку для зручності відладки */}
          <div className="hidden sm:flex items-center text-xs font-black uppercase tracking-wider text-gray-400">
            {isAdmin ? "👑 Адміністратор" : "👤 Клієнт"}
          </div>
        </div>
      </div>
    </nav>
  )
}