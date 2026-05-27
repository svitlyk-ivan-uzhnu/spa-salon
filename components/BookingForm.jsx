'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

// Порожня позиція для додавання нової послуги в чек
const emptyItem = () => ({ service: '', quantity: 1 })

export default function BookingForm({ onSubmit, isSubmitting, error }) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  const [services, setServices] = useState([])
  const [items, setItems] = useState([emptyItem()])
  const [notes, setNotes] = useState('')
  const [loadingServices, setLoadingServices] = useState(true)

  // Список користувачів — лише для адміністратора
  const [users, setUsers] = useState([])
  
  // 🎯 Стейт для вибору клієнта. Використовується ТІЛЬКИ адміном.
  // За замовчуванням він порожній, і ми підставимо туди поточного адміна, якщо він не обере нікого іншого.
  const [selectedUserId, setSelectedUserId] = useState('')

  // 1. Завантаження доступних спа-послуг
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        const available = (data || []).filter((s) => s.available)
        setServices(available)
        setLoadingServices(false)
      })
      .catch(() => setLoadingServices(false))
  }, [])

  // 2. Завантаження списку користувачів для адмінки
  useEffect(() => {
    if (!isAdmin) return
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data)
      })
      .catch(() => {})
  }, [isAdmin])

  // Хеш-мапа для швидкого пошуку послуги за її ID під час рендерингу
  const servicesById = useMemo(() => {
    const map = new Map()
    services.forEach((s) => map.set(s._id, s))
    return map
  }, [services])

  // Розрахунок загальної вартості бронювання в реальному часі
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      const srv = servicesById.get(item.service)
      if (!srv) return sum
      return sum + srv.price * Number(item.quantity || 0)
    }, 0)
  }, [items, servicesById])

  // Оновлення окремого поля (вибір послуги або зміна кількості осіб)
  const updateItem = (index, patch) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  // Додати ще одну процедуру до списку
  const addItem = () => setItems((prev) => [...prev, emptyItem()])

  // Видалити процедуру зі списку
  const removeItem = (index) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  // Перевірка валідності форми перед відправкою
  const currentUserId = session?.user?.id || session?.user?._id
  const canSubmit =
    items.length > 0 &&
    items.every((it) => it.service && Number(it.quantity) >= 1) &&
    (!isAdmin || Boolean(selectedUserId || currentUserId))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      items: items.map((it) => ({
        service: it.service,
        quantity: Number(it.quantity),
      })),
      notes: notes.trim(),
    }

    // Якщо оформлює адмін — беремо або вибраного з випадаючого списку користувача,
    // або (якщо нічого не вибрано) записуємо замовлення на самого адміна.
    if (isAdmin) {
      payload.user = selectedUserId || currentUserId
    }

    onSubmit(payload)
  }

  if (loadingServices) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-gray-500 text-center animate-pulse">
        Завантаження списку спа-послуг...
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Вибір клієнта (Тільки для Адміністратора) */}
        {isAdmin && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">Клієнт Спа-салону *</label>
            <select
              required
              value={selectedUserId || currentUserId || ''}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value={currentUserId || ''}>Оформити на себе (Я — Адміністратор)</option>
              {users.map((u) => (
                // Ховаємо самого адміна зі списку, бо він уже є в опції за замовчуванням
                u._id !== currentUserId && (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email}){u.role === 'admin' ? ' — [Адмін]' : ''}
                  </option>
                )
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Адміністратор може створити запис на будь-якого клієнта салону або на себе.
            </p>
          </div>
        )}

        {/* Список обраних процедур */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-gray-700 font-bold">Обрані спа-процедури *</label>
            <button
              type="button"
              onClick={addItem}
              className="text-emerald-700 hover:text-emerald-900 text-sm font-bold flex items-center gap-1 transition"
            >
              ✨ + Додати процедуру
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const srv = servicesById.get(item.service)
              const subtotal = srv ? srv.price * Number(item.quantity || 0) : 0
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded border"
                >
                  <div className="flex-1 w-full">
                    <select
                      required
                      value={item.service}
                      onChange={(e) => updateItem(index, { service: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="">Оберіть спа-послугу</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id}>
                          [{s.category}] {s.title} — {s.price} грн ({s.duration} хв)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-28 flex items-center gap-2">
                    <span className="text-xs text-gray-500 sm:hidden">Осіб:</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      title="Кількість осіб"
                      placeholder="Осіб"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="w-full sm:w-24 text-right pr-2 text-sm font-medium text-gray-700">
                    {subtotal ? `${subtotal} грн` : '—'}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-300 text-2xl font-light self-end sm:self-center px-2 transition"
                    title="Видалити процедуру"
                  >
                    &times;
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Побажання та коментарі */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Особливі побажання до майстра</label>
          <textarea
            rows="3"
            maxLength="300"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Наприклад: майстер-жінка, алергія на цитрусові олії, парна кімната..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Блок фінальної вартості */}
        {totalPrice > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded transition-all">
            <p className="text-gray-800 flex justify-between items-center">
              <span>
                <strong>Разом до сплати:</strong>{' '}
                <span className="text-sm text-gray-500 ml-1">({items.length} послуг)</span>
              </span>
              <span className="text-2xl font-black text-emerald-700">{totalPrice} грн</span>
            </p>
          </div>
        )}

        {/* Кнопки дій */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="bg-emerald-700 text-white px-6 py-3 rounded hover:bg-emerald-800 font-bold disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Бронювання...' : 'Підтвердити запис'}
          </button>
          <Link
            href="/dashboard/bookings"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 font-bold inline-block text-center transition"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </>
  )
}