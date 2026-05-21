'use client'
import { useState } from 'react'
import MenuCard from './MenuCard'
import { services, getCategories } from '@/lib/services'

const categories = getCategories()

export default function MenuFilter() {
  // Стан для пошуку та фільтрації
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Всі')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  // Логіка фільтрації (замінено menuItems на спільний масив services)
  const filteredItems = services.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'Всі' || item.category === activeCategory
    const matchesAvailability = !showAvailableOnly || item.available
    return matchesSearch && matchesCategory && matchesAvailability
  })

  return (
    <div>
      {/* Пошук */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Пошук процедури чи послуги..."
        className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:border-emerald-500 text-gray-900 shadow-sm"
      />

      {/* Кнопки категорій */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Чекбокс доступності */}
      <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showAvailableOnly}
          onChange={(e) => setShowAvailableOnly(e.target.checked)}
          className="w-4 h-4 accent-emerald-600"
        />
        <span className="text-gray-700 font-medium">Тільки доступні процедури</span>
      </label>

      {/* Кількість знайденого */}
      <p className="text-sm text-gray-500 mb-4">
        Знайдено: {filteredItems.length} з {services.length}
      </p>

      {/* Сітка карток або повідомлення */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-gray-400 font-medium">За вашим запитом нічого не знайдено</p>
      )}
    </div>
  )
}