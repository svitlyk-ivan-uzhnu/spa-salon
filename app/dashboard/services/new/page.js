'use client' // Перетворюємо сторінку на клієнтський компонент

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewServicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const formData = new FormData(e.target)
    
    // Формуємо об'єкт відповідно до структури твого API
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      emoji: formData.get('emoji') || '🌿', // Дефолтне SPA-емодзі
      available: formData.get('available') === 'on'
    }

    try {
      // Відправляємо POST-запит на твій робочий роут
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Не вдалося створити процедуру')
      }

      // Після успішного створення повертаємо користувача до списку
      router.push('/dashboard/services')
      router.refresh() // Оновлюємо кеш Next.js, щоб побачити нову послугу
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-2">
      <Link href="/dashboard/services" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm inline-flex items-center gap-1 hover:underline mb-4">
        &larr; Назад до каталогу
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Додати нову процедуру 🌿</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Назва послуги *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Категорія сервісу *</label>
          <select
            name="category"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="Масаж">Масаж</option>
            <option value="Догляд">Догляд</option>
            <option value="Водні">Водні</option>
            <option value="Інше">Інше</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Вартість (грн) *</label>
          <input
            type="number"
            name="price"
            min="1"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Emoji іконка</label>
          <input
            type="text"
            name="emoji"
            placeholder="🌿"
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Повний опис процедури</label>
          <textarea
            name="description"
            rows="3"
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          ></textarea>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input type="checkbox" name="available" defaultChecked className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">Доступна для бронювання відразу</span>
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm active:scale-98 disabled:opacity-50"
          >
            {saving ? 'Збереження...' : 'Створити послугу'}
          </button>
        </div>
      </form>
    </div>
  )
}