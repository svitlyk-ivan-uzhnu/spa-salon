import StatsCard from "@/components/StatsCard";
import { getServiceStats } from "@/lib/helpers";

export const metadata = { 
  title: "Панель керування | Spa Oasis" 
};

export default function DashboardPage() {
  // Обчислюємо статистику на сервері в момент запиту сторінки
  const stats = getServiceStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Огляд інфопанелі</h1>
      
      {/* Сітка карток з реальними обчисленими даними */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Всього спа-процедур" value={stats.total} color="emerald" />
        <StatsCard title="Доступно для запису" value={stats.available} color="green" />
        <StatsCard title="Середня вартість" value={`${stats.avgPrice} грн`} color="blue" />
      </div>
    </div>
  )
}