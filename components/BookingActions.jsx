// Тиждень 11: Кнопки дій над спа-бронюванням
// Admin: редагувати статус візиту, видалити запис
// User (клієнт, у статусі pending): скасувати візит

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BookingActions({ booking, role, currentUserId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = role === 'admin'
  const isOwner =
    (booking.user?._id || booking.user || '').toString() === currentUserId
  
  // Клієнт може скасувати свій запис лише тоді, коли він ще очікує підтвердження
  const canCancel = isOwner && booking.status === 'pending'

  // Видалення картки бронювання адміністратором
  const handleDelete = async () => {
    if (!confirm('Видалити цей спа-візит із бази даних безповоротно?')) return
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, { method: 'DELETE' })
      setLoading(false)
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Помилка під час видалення запису')
        return
      }
      
      router.push('/dashboard/bookings')
      router.refresh()
    } catch {
      setError('Помилка з’єднання з сервером')
      setLoading(false)
    }
  }

  // Скасування бронювання самим клієнтом
  const handleCancel = async () => {
    if (!confirm('Ви впевнені, що хочете скасувати ваш запис на спа-процедури?')) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      setLoading(false)
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.errors?.[0] || data.error || 'Помилка під час скасування візиту')
        return
      }
      
      router.refresh()
    } catch {
      setError('Помилка з’єднання з сервером')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl mb-3 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}
      
      <div className="flex gap-3 flex-wrap">
        {/* Дії доступні виключно Адміністратору салону */}
        {isAdmin && (
          <>
            <Link
              href={`/dashboard/bookings/${booking._id}/edit`}
              className="bg-emerald-700 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-800 text-sm font-bold shadow-sm transition"
            >
              ⚙️ Керувати статусом
            </Link>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-lg hover:bg-red-100 text-sm font-bold disabled:opacity-50 transition"
            >
              🗑️ Видалити запис
            </button>
          </>
        )}
        
        {/* Клієнтська кнопка скасування (до підтвердження адміном) */}
        {!isAdmin && canCancel && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 text-sm font-bold shadow-sm disabled:opacity-50 transition"
          >
            ❌ Скасувати спа-візит
          </button>
        )}
      </div>
    </div>
  )
}