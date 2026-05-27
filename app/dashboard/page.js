// Dashboard — Server Component для Spa Oasis
// Тиждень 7: Статистика процедур з MongoDB через getDrinkStats()
// Тиждень 11: Статистика спа-візитів доступна виключно адміністрації

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatsCard from "@/components/StatsCard";
import { getBookingStats } from "@/lib/helpers"; // Підключаємо оновлений хелпер статистики

export const metadata = {
  title: "Панель керування | Spa Oasis",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  // Статистика візитів — лише для адмінів, тому запит до бази даних виконується умовно
  const [serviceStats, bookingStats] = await Promise.all([
    getBookingStats(), // Хелпер з 7-го тижня для аналітики каталогу послуг
    isAdmin ? getBookingStats() : Promise.resolve(null), // Запит виконується тільки для ролі admin
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Привітання користувача */}
      <div className="border-b pb-4 border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Вітаємо, {session?.user?.name || "Гість"}! 👋
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Раді бачити вас в особистому кабінеті салону Spa Oasis.
          </p>
        </div>
        <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${
          isAdmin ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"
        }`}>
          {isAdmin ? "👑 Режим адміністратора" : "👤 Кабінет гостя"}
        </span>
      </div>

      {/* РОЗДІЛ 1: АНАЛІТИКА КАТАЛОГУ ПОСЛУГ (Видно всім авторизованим користувачам) */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          💆‍♂️ Діюче спа-меню процедур
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="Усього процедур у базі" value={serviceStats.total} color="emerald" />
          <StatsCard title="Доступно для запису" value={serviceStats.available} color="green" />
          <StatsCard title="Середня вартість сеансу" value={`${serviceStats.avgPrice} грн`} color="indigo" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <StatsCard title="Категорії догляду" value={serviceStats.categoriesCount} color="blue" />
          <StatsCard title="Тимчасово неактивні" value={serviceStats.unavailable} color="red" />
        </div>
      </div>

      {/* РОЗДІЛ 2: ОПЕРАЦІЙНА СТАТИСТИКА ЗАПИСІВ (Конфіденційно: тільки для isAdmin && bookingStats) */}
      {isAdmin && bookingStats && (
        <div className="pt-4 border-t border-gray-100 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            📊 Звітність щодо спа-візитів салону
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatsCard title="Бронювань всього" value={bookingStats.total} color="emerald" />
            <StatsCard title="⏳ Очікують підтвердження" value={bookingStats.pending} color="amber" />
            <StatsCard title="✅ Успішно виконано" value={bookingStats.completed} color="green" />
          </div>
          
          {/* Додаткові операційні індикатори за наявності розширеної аналітики */}
          {(bookingStats.preparing !== undefined || bookingStats.ready !== undefined) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <StatsCard title="💆‍♂️ Клієнти на процедурах зараз" value={bookingStats.preparing || 0} color="indigo" />
              <StatsCard title="✨ Завершені (очікують оплати)" value={bookingStats.ready || 0} color="teal" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}