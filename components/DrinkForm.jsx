'use client'

import { useState } from 'react'
import Link from 'next/link'

// Категорії процедур твого салону відповідно до enum у Mongoose
const CATEGORIES = ['Масаж', 'Догляд за обличчям', 'Догляд за тілом', 'СПА пакети', 'Інше']

export default function DrinkForm({
  initialData, onSubmit, submitLabel = 'Зберегти',
  isSubmitting, error
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    emoji: initialData?.emoji || '🌿', // додаємо емодзі для спа-процедур
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...formData, price: Number(formData.price) })
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Назва процедури *
            </label>
            <input type="text" name="name"
              value={formData.name} onChange={handleChange}
              required className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Категорія *
            </label>
            <select name="category"
              value={formData.category} onChange={handleChange}
              required className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white">
              <option value="">Оберіть категорію</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Вартість (грн) *
            </label>
            <input type="number" name="price"
              value={formData.price} onChange={handleChange}
              required className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Іконка (Емодзі)
            </label>
            <input type="text" name="emoji"
              value={formData.emoji} onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="💆, 🌿, 🌸" />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm">
            Опис процедури та ефект
          </label>
          <textarea name="description"
            value={formData.description} onChange={handleChange}
            rows="4" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" />
        </div>

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 font-bold disabled:opacity-50 transition shadow-sm cursor-pointer">
            {isSubmitting ? 'Збереження...' : submitLabel}
          </button>
          <Link href="/dashboard/services"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-bold inline-block transition text-center">
            Скасувати
          </Link>
        </div>
      </form>
    </>
  )
}