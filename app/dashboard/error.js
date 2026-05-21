'use client' // ОБОВ'ЯЗКОВО!

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // Фіксуємо внутрішню помилку панелі керування в консолі
    console.error('Dashboard critical error caught:', error)
  }, [error])

  return (
    <div className="max-w-md mx-auto mt-16 bg-white border border-red-100 rounded-2xl shadow-sm p-8 text-center">
      <div className="text-5xl mb-4">⚙️❌</div>
      <h2 className="text-2xl font-black text-red-600 mb-2">
        Помилка панелі керування
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 bg-red-50/50 p-3 rounded-xl border border-red-50 font-mono">
        {error.message || 'Не вдалося завантажити дані робочої панелі.'}
      </p>
      
      <div className="flex gap-4">
        {/* Кнопка спроби відновити поточний стан адмінки */}
        <button
          onClick={() => reset()}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide transition shadow-sm cursor-pointer active:scale-98"
        >
          Спробувати знову &orarr;
        </button>
        
        {/* Посилання безпечної евакуації користувача на головну сайту */}
        <Link
          href="/"
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide text-center transition active:scale-98"
        >
          На головну
        </Link>
      </div>
    </div>
  )
}