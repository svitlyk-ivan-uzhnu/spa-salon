// Тиждень 11: Редагування спа-бронювання (admin only — status + notes)
// Позиції візиту (items) у цьому тижні відображаються як read-only.

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

// Статуси адаптовані під бізнес-процеси спа-салону відповідно до моделі Order
const STATUSES = [
  { value: 'pending',    label: '⏳ Очікує підтвердження' },
  { value: 'preparing',  label: '💆‍♂️ Клієнт на процедурі' },
  { value: 'ready',      label: '✨ Процедуру завершено (Очікує оплати)' },
  { value: 'completed',  label: '✅ Візит успішно виконано' },
  { value: 'cancelled',  label: '❌ Запис скасовано' },
]

export default function EditBookingPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status: sessionStatus } = useSession()

  const [booking, setBooking] = useState(null)
  const [status, setStatus] = useState('pending')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Отримуємо поточні дані про візит із нашого API спа-бронювань
    fetch(`/api/bookings/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }
        setBooking(data)
        setStatus(data.status)
        setNotes(data.notes || '')
        setLoading(false)
      })
      .catch(() => {
        setError('Не вдалося завантажити дані')
        setLoading(false)
      })
  }, [params.id])

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-gray-500 animate-pulse">
        ⏳ Завантаження картки візиту...
      </div>
    )
  }

  // Перевірка прав доступу: Лише адміністратор салону має доступ до цієї форми
  if (session?.user?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm font-medium">
        🛡️ Доступ заблоковано: Редагувати статус або службові замітки візиту може виключно адміністратор Spa Oasis.
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch(`/api/bookings/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    
    const body = await res.json().catch(() => ({}))
    setSaving(false)

    if (!res.ok) {
      setError(body.errors?.join(', ') || body.error || 'Помилка під час збереження змін')
      return
    }

    // Повертаємо менеджера на сторінку детального перегляду візиту
    router.push(`/dashboard/bookings/${params.id}`)
    router.refresh()
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
        {error || 'Спа-бронювання не знайдено в базі даних'}
      </div>
    )
  }

  const items = booking.items || []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Link
          href={`/dashboard/bookings/${params.id}`}
          className="text-emerald-700 hover:text-emerald-900 font-medium text-sm inline-flex items-center gap-1 transition"
        >
          &larr; Назад до деталей візиту
        </Link>
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
        ⚙️ Керування спа-візитом #{booking._id.slice(-6).toUpperCase()}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        
        {/* Інформаційний інформативний блок клієнта та заброньованих послуг (Read-Only) */}
        <div className="text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-600 space-y-3">
          <div>
            Гість: <strong className="text-gray-900">{booking.user?.name || 'Видалений акаунт'}</strong>
          </div>
          
          <div className="border-t border-gray-200/60 pt-2">
            <span className="font-semibold text-gray-700">Обраний комплекс послуг (Змінити не можна):</span>
            <ul className="mt-1.5 ml-2 space-y-1">
              {items.map((it) => {
                const currentService = it.drink || it.service
                return (
                  <li key={it._id} className="flex items-center gap-1.5 text-gray-800 text-xs">
                    <span>{currentService ? `${currentService.emoji} ${currentService.name}` : '🌿 (Послугу видалено)'}</span>
                    <span className="text-gray-400 font-bold">×</span>
                    <span className="font-semibold text-emerald-800">{it.quantity} осіб</span>
                    <span className="text-gray-400">({it.priceAtOrder} грн/особа)</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="border-t border-gray-200/60 pt-2 text-base text-gray-900 flex justify-between items-center">
            <span>Разом до сплати:</span>
            <strong className="text-emerald-700 font-black">{booking.totalPrice} грн</strong>
          </div>
        </div>

        {/* Форма вибору статусу */}
        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm tracking-wide">Поточний статус візиту *</label>
          <select
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-emerald-500 bg-white shadow-sm text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Форма внутрішнього коментаря / нотаток */}
        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm tracking-wide">Службові нотатки адміністратора</label>
          <textarea
            rows="3"
            maxLength="300"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Вкажіть номер кабінету, призначеного майстра або залиште важливі уточнення щодо здоров'я гостя..."
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-emerald-500 text-sm shadow-sm"
          />
        </div>

        {/* Кнопки дій */}
        <div className="flex gap-4 border-t pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 font-bold disabled:opacity-50 transition text-sm shadow-sm"
          >
            {saving ? 'Збереження...' : 'Зберегти зміни'}
          </button>
          <Link
            href={`/dashboard/bookings/${params.id}`}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 font-bold inline-block text-center transition text-sm"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  )
}