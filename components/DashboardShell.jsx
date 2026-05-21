'use client'
import { useState } from 'react'
import DashboardNav from './DashboardNav'
import SidebarToggle from './SidebarToggle'

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-[calc(100vh-135px)]">
      {/* Бокова панель зі змінною шириною transition-all */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64 p-6' : 'w-20 p-3'}`}>
        <SidebarToggle isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {sidebarOpen ? (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6 tracking-wide text-emerald-400">Spa Oasis Admin</h2>
            <DashboardNav />
          </div>
        ) : (
          <div className="text-center text-xl">🌿</div>
        )}
      </aside>

      {/* Контент сторінок адмінки */}
      <div className="flex-1 bg-gray-50 p-8">
        {children}
      </div>
    </div>
  )
}