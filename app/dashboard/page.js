export const metadata = {
  title: "Панель керування | Spa Oasis",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Огляд інфопанелі</h1>
      
      {/* Сітка з картками статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Картка 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Активні процедури</h3>
          <p className="text-4xl font-bold text-emerald-700 mt-2">18</p>
        </div>
        
        {/* Картка 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Записи на сьогодні</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">34</p>
        </div>
        
        {/* Картка 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Денна виручка</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">28 600 ₴</p>
        </div>
      </div>
    </div>
  );
}