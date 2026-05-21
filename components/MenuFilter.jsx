'use client'
import { useState } from 'react'
import MenuCard from './MenuCard'

// Дані спа-процедур салону «Spa Oasis»
const menuItems = [
  { id: 1, name: "Масаж «Гаряче каміння»", description: "Глибоке розслаблення м'язів за допомогою розігрітих вулканічних каменів та аромаолій.", price: 1200, emoji: "🌋", category: "Масаж", available: true },
  { id: 2, name: "Тайський традиційний масаж", description: "Класична техніка розтягування та точкового масажу для відновлення енергії.", price: 1400, emoji: "🧘‍♂️", category: "Масаж", available: true },
  { id: 3, name: "Шоколадне обгортання", description: "Поживне маскування всього тіла натуральним шоколадом для гладкості шкіри.", price: 1500, emoji: "🍫", category: "Догляд", available: true },
  { id: 4, name: "Пілінг з морською сіллю", description: "Глибоке очищення та оновлення шкіри за допомогою мінералів та делікатного скрабу.", price: 900, emoji: "🧼", category: "Догляд", available: true },
  { id: 5, name: "Ультразвукова чистка обличчя", description: "Сучасна апаратна процедура для делікатного догляду за шкірою обличчя.", price: 1100, emoji: "✨", category: "Косметологія", available: true },
  { id: 6, name: "Антивікова ліфтинг-програма", description: "Комплексний омолоджуючий догляд з використанням преміальних сироваток.", price: 1800, emoji: "💆‍♀️", category: "Косметологія", available: false },
  { id: 7, name: "Пакет «Повне відновлення»", description: "Комплекс: розпарювання у фітобочці, скрабування та заспокійливий масаж.", price: 2400, emoji: "🌿", category: "СПА-пакети", available: false },
  { id: 8, name: "Експрес-релакс для двох", description: "Одночасний розслаблюючий масаж та відпочинок у термальній зоні для пари.", price: 3200, emoji: "🥂", category: "СПА-пакети", available: true },
]

// Автоматичне формування списку категорій
const categories = ["Всі", ...new Set(menuItems.map(item => item.category))]

export default function MenuFilter() {
  // Стан для пошуку та фільтрації
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Всі')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  // Логіка фільтрації
  const filteredItems = menuItems.filter(item => {
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
        Знайдено: {filteredItems.length} з {menuItems.length}
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