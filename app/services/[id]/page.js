import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/services";

// Динамічна генерація метаданих (вкладки в браузері)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = getServiceById(id);
  if (!service) return { title: "Процедуру не знайдено | Spa Oasis" };

  return {
    title: `${service.name} | Spa Oasis`,
    description: service.description,
  };
}

// Головний компонент сторінки деталей послуги
export default async function ServicePage({ params }) {
  const { id } = await params;
  const service = getServiceById(id);

  // Якщо процедури з таким ID немає у файлі lib/services.js — показуємо нашу кастомну 404
  if (!service) {
    notFound();
  }

  return (
    <div>
      {/* Шапка детальної сторінки з градієнтом */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-12 shadow-md">
        <div className="container mx-auto px-4">
          <Link href="/services" className="text-emerald-200 hover:text-white transition font-medium inline-flex items-center gap-2">
            &larr; Назад до послуг
          </Link>
          <div className="mt-6 flex items-center gap-6">
            <span className="text-7xl bg-white bg-opacity-10 p-4 rounded-2xl shadow-inner">{service.emoji}</span>
            <div>
              <h1 className="text-4xl font-bold mb-1">{service.name}</h1>
              <span className="text-emerald-200 bg-emerald-900 bg-opacity-40 px-3 py-1 rounded-full text-sm font-medium">
                {service.category}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Контентна частина з деталями */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl border border-gray-100">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Блок ціни */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Вартість сеансу</h3>
                <p className="text-2xl font-bold text-emerald-700">{service.price} грн</p>
              </div>
              
              {/* Блок доступності запису */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Статус запису</h3>
                <div className="mt-1">
                  {service.available ? (
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      🟢 Доступно для запису
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      🔴 Усі майстри зайняті
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Блок з повним описом */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-2">Про процедуру</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}