'use client'

export default function SidebarToggle({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-center text-gray-400 hover:text-emerald-400 transition mb-6 cursor-pointer text-sm font-medium border border-gray-700/50 py-1.5 rounded-lg bg-gray-800"
      title={isOpen ? 'Згорнути меню' : 'Розгорнути меню'}
    >
      {isOpen ? '◀ Згорнути' : '▶ Меню'}
    </button>
  )
}