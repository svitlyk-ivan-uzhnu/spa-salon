'use client' 

import { useState, useEffect } from 'react'
import Link from 'next/link'
// Імпортуємо наш TableSkeleton для гарної індикації завантаження таблиці
import { TableSkeleton } from '@/components/skeletons/PostSkeleton'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Функція для отримання списку послуг з нашого API
 async function fetchServices() {
    try {
      // Рядок setLoading(true) видалено звідси!
      const response = await fetch('/api/services') // або /api/services
      if (!response.ok) throw new Error('Не вдалося завантажити каталог послуг')
      const data = await response.json()
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Викликаємо отримання даних при першому рендері сторінки
  useEffect(() => {
    fetchServices()
  }, [])

  // Функція видалення процедури за її ID за допомогою методу DELETE
  async function handleDelete(id) {
    if (!confirm('Ви дійсно бажаєте видалити цю процедуру з каталогу салону?')) return

    try {
      const response = await fetch(`/api/drinks/${id}`, { // або `/api/services/${id}`
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Помилка під час видалення процедури')
      
      // Після успішного видалення на сервері — оновлюємо локальний список
      fetchServices()
    } catch (err) {
      alert(err.message)
    }
  }

  // Якщо дані завантажуються — показуємо наш кастомний анімований TableSkeleton!
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-36 animate-pulse"></div>
        </div>
        <TableSkeleton rows={5} />
      </div>
    )
  }

  // Обробка екрана помилки з можливістю повторного запиту
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <span className="text-4xl block mb-2">⚠️</span>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button 
          onClick={fetchServices} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm"
        >
          Спробувати знову &orarr;
        </button>
      </div>
    )
  }

  return (
    <div className="p-1">
      {/* Шапка з лічильником кількості процедур та кнопкою додавання нових */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900💡">
          Керування послугами <span className="text-emerald-600 font-mono text-2xl">({services.length})</span>
        </h1>
        <Link
          href="/dashboard/services/new" // або /dashboard/drinks/new
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide transition shadow-sm active:scale-98"
        >
          + Додати послугу
        </Link>
      </div>

      {/* Головна таблиця керування */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/70">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Назва</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Категорія</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Вартість</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Доступність</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition">
                {/* Назва та емодзі з посиланням на детальну картку */}
                <td className="px-6 py-4 font-semibold text-gray-900">
                  <Link href={`/dashboard/services/${service.id}`} className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-2">
                    <span className="text-lg">{service.emoji}</span> {service.name}
                  </Link>
                </td>
                {/* Категорія */}
                <td className="px-6 py-4 text-gray-500 text-sm">{service.category}</td>
                {/* Ціна */}
                <td className="px-6 py-4 font-mono font-bold text-gray-700 text-sm">{service.price} грн</td>
                {/* Статус доступності бейджиком */}
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                    service.available
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {service.available ? 'Активна' : 'Призупинено'}
                  </span>
                </td>
                {/* Кнопка швидкого інтерактивного видалення */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold tracking-wide cursor-pointer transition hover:underline"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}