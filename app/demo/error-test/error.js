'use client' // ОБОВ'ЯЗКОВО! Компонент інтерактивний завдяки кнопці reset та useEffect

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Логуємо помилку в консоль браузера для розробника
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
        {/* Іконка попередження */}
        <div className="text-6xl mb-4 animate-bounce">⚠️</div>
        
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Виникла технічна помилка
        </h2>
        
        {/* Текст помилки, який ми викинули через throw new Error */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 bg-red-50/50 p-3 rounded-xl border border-red-50 font-mono">
          {error.message}
        </p>
        
        {/* Кнопка скидання (reset), яка намагається перерендерити сторінку */}
        <button
          onClick={() => reset()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide transition shadow-sm cursor-pointer active:scale-98"
        >
          Спробувати знову &orarr;
        </button>
      </div>
    </div>
  )
}