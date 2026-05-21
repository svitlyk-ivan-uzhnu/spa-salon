import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center px-4">
        {/* Спа-емодзі замість кави */}
        <p className="text-6xl mb-4 animate-bounce">🌿🧖‍♀️✨</p>
        
        {/* Заголовок помилки */}
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        
        {/* Текст повідомлення */}
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Ой! Цю сторінку не знайдено. Можливо, її перенесли або процедуру було скасовано.
        </p>
        
        {/* Кнопка повернення на головну */}
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
        >
          Повернутися в оазис ➡️
        </Link>
      </div>
    </div>
  );
}