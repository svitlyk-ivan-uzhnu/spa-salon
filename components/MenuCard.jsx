// Компонент картки послуги з props
// Тема: Спа-салон (Spa Oasis)

export default function MenuCard({ name, description, price, emoji, category, available = true }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${
      !available ? 'opacity-60' : ''
    }`}>
      {/* Верхня частина з іконкою-emoji */}
      <div className="h-32 bg-emerald-50 flex items-center justify-center">
        <span className="text-5xl">{emoji}</span>
      </div>

      {/* Контент картки */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          
          {/* Умовний рендеринг статусу доступності */}
          {available ? (
            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
              Доступно
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-medium">
              Зайнято
            </span>
          )}
        </div>

        {/* Опис процедури */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Футер картки: Ціна та Категорія */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-emerald-700 font-bold text-lg">{price} грн</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}