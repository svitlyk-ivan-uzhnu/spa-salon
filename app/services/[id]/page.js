import Link from "next/link";
import { notFound } from "next/navigation";
import { getDrinkById as getServiceById } from "@/lib/services";
import FavoriteButton from "@/components/FavoriteButton";

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="text-emerald-700 hover:text-emerald-900 font-medium mb-6 inline-block">
        &larr; Назад на головну
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          {/* Назва процедури + розумна Клієнтська кнопка обраного */}
          <div className="flex items-center gap-3">
            <span className="text-4xl">{service.emoji}</span>
            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
            <FavoriteButton serviceId={service.id} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase">Категорія</h3>
            <p className="text-lg font-semibold text-gray-900">{service.category}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase">Ціна</h3>
            <p className="text-lg font-semibold text-emerald-700">{service.price} грн</p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">{service.description}</p>
      </div>
    </div>
  );
}