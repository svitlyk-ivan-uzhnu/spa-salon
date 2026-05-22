import ServiceActions from '@/components/ServiceActions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Функція для отримання даних на серверній стороні (або заміни її на свій метод/fetch)
async function getServiceData(id) {
  // Звертаємось до локального API або прямо до бази даних
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/services/${id}`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ServiceDetailPage({ params }) {
  const { id } = await params
  const service = await getServiceData(id)

  // Якщо процедуру з таким ID не знайдено — показуємо 404
  if (!service) {
    notFound()
  }

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <Link href="/dashboard/services" className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline mb-6 inline-block">
        &larr; Назад до списку послуг
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Головна інформація */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{service.emoji || '🌿'}</span>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{service.name}</h1>
            </div>
            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full mt-3 uppercase tracking-wider">
              {service.category}
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Вартість</p>
            <p className="text-3xl font-mono font-black text-emerald-700 mt-1">{service.price} грн</p>
          </div>
        </div>

        {/* Опис */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Опис процедури</h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            {service.description || 'Опис для цієї процедури ще не додано.'}
          </p>
        </div>

        {/* Статус доступності */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-gray-500">Статус у каталозі:</span>
          <span className={`font-semibold ${service.available ? 'text-emerald-600' : 'text-red-500'}`}>
            {service.available ? '● Доступна для запису' : '● Тимчасово призупинено'}
          </span>
        </div>

        {/* Панель дій (Кнопки Редагувати / Видалити) */}
        <div className="border-t border-gray-100 pt-6 flex justify-end">
          {/* ✅ Передаємо правильний компонент та проп serviceId */}
          <ServiceActions serviceId={id} />
        </div>
      </div>
    </div>
  )
}