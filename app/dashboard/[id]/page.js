import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/services";
import ServiceActions from "@/components/ServiceActions"; 

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div>
      <Link href="/dashboard/services" className="text-emerald-700 hover:text-emerald-900 font-medium mb-4 inline-block">
        &larr; Назад до списку
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Шапка картки */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl bg-emerald-50 p-3 rounded-xl">{service.emoji}</span>
            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
          </div>
          
          {/* Вбудовуємо інтерактивний клієнтський компонент дій */}
          <ServiceActions serviceId={service.id} />
        </div>

        {/* Параметри послуги */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Категорія</h3>
            <p className="text-lg font-semibold text-gray-900">{service.category}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Ціна за сеанс</h3>
            <p className="text-lg font-semibold text-emerald-700">{service.price} грн</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Статус доступності</h3>
            <p className="mt-1">
              {service.available ? (
                <span className="text-green-600 font-bold">🟢 Доступно</span>
              ) : (
                <span className="text-red-600 font-bold">🔴 Зайнято</span>
              )}
            </p>
          </div>
        </div>

        {/* Повний опис */}
        <div className="mt-6">
          <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-2">Опис процедури</h3>
          <p className="text-gray-700 leading-relaxed">{service.description}</p>
        </div>
      </div>
    </div>
  );
}