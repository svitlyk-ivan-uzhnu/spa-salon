import Link from "next/link";
import { services } from "@/lib/services";

export const metadata = {
  title: "Управління послугами | Spa Oasis",
};

export default function ServicesListPage() {
  return (
    <div>
      {/* Верхня панель дій */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Спа-послуги</h1>
        <Link
          href="/dashboard/services/new"
          className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-800 transition shadow-sm"
        >
          + Додати послугу
        </Link>
      </div>

      {/* Таблиця послуг */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Процедура</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Категорія</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Вартість</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50/70 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.emoji}</span>
                    <span className="font-semibold text-gray-900">{service.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{service.category}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{service.price} грн</td>
                <td className="px-6 py-4">
                  {service.available ? (
                    <span className="text-xs px-2 py-1 rounded-md bg-green-100 text-green-700 font-medium">Доступно</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-700 font-medium">Зайнято</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/services/${service.id}`}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                  >
                    Переглянути
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}