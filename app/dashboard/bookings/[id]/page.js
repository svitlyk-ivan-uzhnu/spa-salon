// Тиждень 11: Деталі одного спа-бронювання (many-to-many через BookingItem)
// Server Component — populate items.service через virtual

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Booking from '@/lib/models/Order'       // Відповідає схемі Order з таски
import BookingItem from '@/lib/models/OrderItem' // Відповідає схемі OrderItem з таски
import Service from '@/lib/models/Drink'         // Відповідає схемі Drink з таски
import User from '@/lib/models/User'
import BookingStatusBadge from '@/components/BookingStatusBadge'
import BookingActions from '@/components/BookingActions'

// Реєструємо моделі для коректного відпрацювання Mongoose populate()
void [Service, User, BookingItem]

export default async function BookingDetailsPage({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { id } = await params
  await dbConnect()

  let booking
  try {
    // Виконуємо каскадний populate для витягування даних користувача та інформації про послуги через проміжну pivot-модель
    booking = await Booking.findById(id)
      .populate({ path: 'user', select: 'name email role' })
      .populate({
        path: 'items',
        populate: { path: 'drink', select: 'name price emoji category description' }, // Шлях за схемою залишається 'drink' або твоїм мапінгом 'service'
      })
      .lean({ virtuals: true })
  } catch {
    notFound()
  }
  if (!booking) notFound()

  const isAdmin = session.user.role === 'admin'
  const isOwner = booking.user?._id?.toString() === session.user.id
  if (!isAdmin && !isOwner) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
        У вас немає доступу до перегляду деталей цього спа-візиту.
      </div>
    )
  }

  // Серіалізуємо Mongoose-документ для безпечної передачі в клієнтські компоненти
  const serialized = JSON.parse(JSON.stringify(booking))
  const items = serialized.items || []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/dashboard/bookings" className="text-emerald-700 hover:text-emerald-900 font-medium text-sm flex items-center gap-1 transition">
          &larr; Назад до списку візитів
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Спа-візит #{serialized._id.slice(-6).toUpperCase()}
        </h1>
        <BookingStatusBadge status={serialized.status} />
      </div>

      {/* Інформаційна картка візиту */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <InfoRow label="Час оформлення">
          {new Date(serialized.createdAt).toLocaleString('uk-UA', {
            dateStyle: 'long',
            timeStyle: 'short'
          })}
        </InfoRow>

        <InfoRow label="Гість салону">
          {serialized.user ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-bold text-gray-900">{serialized.user.name}</span>
              <span className="text-gray-500 text-sm">({serialized.user.email})</span>
            </div>
          ) : (
            <span className="italic text-gray-400">—</span>
          )}
        </InfoRow>

        {serialized.notes && (
          <InfoRow label="Побажання">
            <span className="text-gray-700 bg-amber-50 border border-amber-100/50 rounded-lg px-3 py-2 text-sm inline-block italic">
              &ldquo;{serialized.notes}&rdquo;
            </span>
          </InfoRow>
        )}
      </div>

      {/* Таблиця заброньованих процедур */}
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
        🌿 Перелік обраних процедур
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Спа-процедура</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Фіксована ціна</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Кількість осіб</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Сума</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400 italic">
                    Процедур не обрано
                  </td>
                </tr>
              ) : (
                items.map((it) => {
                  // Використовуємо snapshot фіксованої ціни на момент замовлення
                  const currentService = it.drink || it.service
                  const subtotal = it.priceAtOrder * it.quantity
                  
                  return (
                    <tr key={it._id} className="hover:bg-emerald-50/10 transition">
                      <td className="px-5 py-4">
                        {currentService ? (
                          <div>
                            <div className="font-bold text-gray-900 text-sm">
                              {currentService.emoji} {currentService.name}
                            </div>
                            <div className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                              {currentService.category}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">(Послугу видалено з каталогу салону)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-gray-600 font-medium">
                        {it.priceAtOrder} грн
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-gray-600 font-bold">
                        {it.quantity}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-black text-gray-950">
                        {subtotal} грн
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
           <tfoot className="bg-gray-50/70 font-semibold border-t">
            <tr>
              <td colSpan={3} className="px-5 py-4 text-right font-bold text-gray-700">
                Загальна вартість візиту:
              </td>
              <td className="px-5 py-4 text-right text-xl font-black text-emerald-700">
                {serialized.totalPrice} грн
              </td>
            </tr>
          </tfoot>
          </table>
        </div>
      </div>

      {/* Блок інтерактивних дій зі статусами замовлення */}
      <div className="mt-6">
        <BookingActions
          booking={serialized}
          role={session.user.role}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <div className="w-36 text-xs font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 pt-0.5">{label}</div>
      <div className="flex-1 text-gray-900 text-sm font-medium">{children}</div>
    </div>
  )
}