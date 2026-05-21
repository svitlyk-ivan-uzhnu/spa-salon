import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

export default function MenuCard({ id, name, description, price, emoji, category, available }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition">
      <div>
        {/* Шапка картки (без змін) */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-3xl bg-emerald-50 p-2 rounded-xl">{emoji}</span>
        </div>

        {/* Назва та опис (без змін) */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>
      </div>

      {/* Нижня частина картки (ОНОВЛЕНО) */}
      <div className="border-t border-gray-50 pt-4 mt-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs text-gray-400 block font-medium">Ціна</span>
          <span className="text-lg font-extrabold text-emerald-700">{price} грн</span>
        </div>

        {/* ПОВЕРТАЄМО КНОПКУ "ДЕТАЛЬНІШЕ" + ІНТЕРАКТИВНА ЗОНА: */}
        <div className="flex items-center gap-3">
          {/* Інтерактивна зона (серце + статус) */}
          <div className="flex items-center gap-2">
            {id && <FavoriteButton serviceId={id} />}
            {available ? (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">Доступно</span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-medium">Зайнято</span>
            )}
          </div>

          {/* ПОСИЛАННЯ "ДЕТАЛЬНІШЕ": */}
          {id && (
            <Link
              href={`/services/${id}`} // Або `/dashboard/services/${id}` якщо ти в адмінці
              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold transition"
            >
              Детальніше &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}