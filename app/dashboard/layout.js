import DashboardNav from "@/components/DashboardNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-130px)]">
      {/* Лівий сайдбар */}
      <aside className="w-64 bg-gray-800 text-white p-6 shadow-xl flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-emerald-400 tracking-wide flex items-center gap-2">
          Панель спа 🌿
        </h2>
        <DashboardNav />
      </aside>

      {/* Основна робоча область */}
      <div className="flex-1 bg-gray-50 p-8">
        {children}
      </div>
    </div>
  );
}