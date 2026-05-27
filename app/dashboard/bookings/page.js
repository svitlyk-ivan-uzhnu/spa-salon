'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import BookingStatusBadge from '@/components/BookingStatusBadge' // Перейменовано для Spa Oasis

export default function BookingsListPage() {
  const { data: session } = useSession()
  const role = session?.user?.role

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Запит до нашого API спа-бронювань
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="h-10 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Завантаження списку візитів...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {role === 'admin' ? 'Усі записи салону' : 'Мої спа-візити'}
        </h1>
        <Link
          href="/dashboard/bookings/new"
          className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 transition font-bold shadow-sm text-sm"
        >
          ✨ Записатись на процедуру
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
          У вас ще немає запланованих візитів до нашого салону.
        </div>
      ) : role === 'admin' ? (
        <AdminTable bookings={bookings} />
      ) : (
        <UserCards bookings={bookings} />
      )}
    </div>
  )
}

// 👁️ Стисле прев'ю процедур: перші 2 + "і ще N" для компактності таблиці
function ItemsPreview({ items }) {
  if (!items || items.length === 0) {
    return <span className="text-gray-400 italic">(процедури не обрано)</span>
  }
  const visible = items.slice(0, 2)
  const rest = items.length - visible.length
  return (
    <div className="text-sm space-y-0.5">
      {visible.map((it, idx) => (
        <div key={it._id || idx} className="text-gray-700">
          {it.service ? (
            <>
              <span className="font-medium text-emerald-800">🌿 {it.service.title}</span>
              <span className="text-gray-500 text-xs"> × {it.quantity} осіб</span>
            </>
          ) : (
            <span className="text-gray-400 italic">(послугу видалено) × {it.quantity}</span>
          )}
        </div>
      ))}
      {rest > 0 && (
        <div className="text-xs font-medium text-emerald-600/80 pt-0.5">і ще {rest} процедур…</div>
      )}
    </div>
  )
}

// 👑 ТАБЛИЦЯ ДЛЯ АДМІНІСТРАТОРА (Повний контроль над розкладом салону)
function AdminTable({ bookings }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Дата запису</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Клієнт</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Обрані процедури</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Сума</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-emerald-50/30 transition">
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {new Date(booking.createdAt).toLocaleString('uk-UA', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-6 py-4">
                  {booking.user ? (
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{booking.user.name}</div>
                      <div className="text-xs text-gray-500">{booking.user.email}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <ItemsPreview items={booking.items} />
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{booking.totalPrice} грн</td>
                <td className="px-6 py-4">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/bookings/${booking._id}`}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-sm underline"
                  >
                    Керувати
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 👤 КАРТКИ ДЛЯ КЛІЄНТА (Зручний мобільний вигляд для перегляду особистих візитів)
function UserCards({ bookings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookings.map((booking) => {
        const itemsCount = booking.items?.length || 0
        return (
          <Link
            key={booking._id}
            href={`/dashboard/bookings/${booking._id}`}
            className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md hover:border-emerald-200 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3 gap-2">
                <div>
                  <h3 className="font-black text-gray-900 text-base">
                    Спа-візит #{booking._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {new Date(booking.createdAt).toLocaleString('uk-UA', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <div className="mb-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                <ItemsPreview items={booking.items} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm border-t pt-3 mt-1">
                <span className="text-gray-500 font-medium">
                  {itemsCount} {itemsCount === 1 ? 'процедура' : itemsCount < 5 ? 'процедури' : 'процедур'}
                </span>
                <span className="font-black text-emerald-700 text-base">{booking.totalPrice} грн</span>
              </div>
              {booking.notes && (
                <div className="bg-amber-50/40 text-amber-800 text-xs px-2.5 py-1.5 rounded mt-3 border border-amber-100/50 italic line-clamp-1">
                  &ldquo;{booking.notes}&rdquo;
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}