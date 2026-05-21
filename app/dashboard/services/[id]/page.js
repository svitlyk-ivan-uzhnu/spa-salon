import DrinkActions from '@/components/DrinkActions'
import { getDrinkById } from '@/lib/services' // або отримуй дані через fetch на клієнті
import { notFound } from 'next/navigation'

export default async function DashboardServiceDetailPage({ params }) {
  // Розгортаємо id в Next.js 15+
  const { id } = await params
  const service = await getDrinkById(id)

  if (!service) notFound()

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-4xl block mb-2">{service.emoji}</span>
          <h1 className="text-3xl font-extrabold text-gray-900">{service.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Категорія: {service.category}</p>
        </div>
        
        {/* Кнопка видалення, яку ми щойно оновили */}
        <DrinkActions serviceId={service.id} serviceName={service.name} />
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Вартість</h3>
          <p className="text-lg font-mono font-bold text-emerald-600">{service.price} грн</p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Опис послуги</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{service.description || 'Опис відсутній.'}</p>
        </div>
      </div>
    </div>
  )
}