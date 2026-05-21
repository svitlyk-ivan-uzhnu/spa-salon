'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceActions({ serviceId }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    console.log(`Видалення спа-процедури з ID: ${serviceId}`)
    setShowConfirm(false)
    // Після видалення програмно повертаємо менеджера до списку послуг в адмінці
    router.push('/dashboard/services')
  }

  if (showConfirm) {
    return (
      <div className="space-x-2 flex items-center bg-red-50 p-2 rounded-lg border border-red-100 animate-pulse">
        <span className="text-red-600 font-bold mr-2 text-sm">Видалити процедуру?</span>
        <button 
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-1.5 rounded-md font-medium hover:bg-red-700 transition cursor-pointer"
        >
          Так
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          className="bg-gray-300 text-gray-700 px-4 py-1.5 rounded-md font-medium hover:bg-gray-400 transition cursor-pointer"
        >
          Ні
        </button>
      </div>
    )
  }

  return (
    <div className="space-x-2">
      <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition cursor-pointer">
        Редагувати
      </button>
      <button 
        onClick={() => setShowConfirm(true)}
        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition cursor-pointer"
      >
        Видалити
      </button>
    </div>
  )
}