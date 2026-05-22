// ✅ Виправили шлях до файлу хелперів (додали "s" на кінці @/lib/helpers)
import { getDrinkStats } from "@/lib/helpers";
import Link from "next/link";

export default async function DashboardPage() {
  let stats = null;
  let errorMsg = null;

  try {
    stats = await getDrinkStats();
  } catch (error) {
    errorMsg = error.message;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Привітання */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Огляд салону <span className="text-emerald-600">Spa Oasis 🌿</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Актуальна аналітика та стан каталогу послуг з бази даних MongoDB.
          </p>
        </div>
      </div>

      {/* Якщо база даних видала помилку підключення, показуємо картку помилки замість статистики */}
      {errorMsg ? (
        <div className="p-6 text-center max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl shadow-sm">
          <span className="text-4xl block mb-2">⚠️</span>
          <h3 className="text-red-700 font-bold text-lg">Помилка аналітики</h3>
          <p className="text-red-600 text-sm mt-1 mb-2">{errorMsg}</p>
          <p className="text-xs text-gray-400">Перевірте правильність підключення до бази даних у файлі .env.local</p>
        </div>
      ) : (
        /* Сітка з картками статистики (показується, коли все добре) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Всього послуг */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-emerald-50 rounded-xl text-2xl text-emerald-600 font-bold">📊</div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Всього послуг</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats?.total || 0}</p>
            </div>
          </div>

          {/* Середня ціна */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-amber-50 rounded-xl text-2xl text-amber-600 font-bold">💰</div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Середня вартість</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats?.avgPrice || 0} грн</p>
            </div>
          </div>

          {/* Доступно зараз */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-xl text-2xl text-blue-600 font-bold">✨</div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Доступно зараз</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {stats?.available || 0} <span className="text-xs text-gray-400 font-normal">/ з {stats?.total || 0}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🌿 Нижня плашка дій — тепер вона ЗА блоком помилки, має свій темний фон і закриті теги */}
      <div className="bg-emerald-950 p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-emerald-900">
        <div className="block">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Бажаєш оновити прейскурант або додати нову процедуру?
          </h3>
          <p className="text-emerald-200/80 text-sm mt-1">
            Перейди в менеджер послуг для повного керування записами.
          </p>
        </div>
        <Link 
          href="/dashboard/services" 
          className="bg-white hover:bg-emerald-50 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition active:scale-98 shrink-0 block text-center no-underline"
        >
          Управління послугами &rarr;
        </Link>
      </div>
    </div>
  );
}