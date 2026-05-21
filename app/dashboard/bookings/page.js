import Link from "next/link";

// Реалістичні дані бронювань для спа-салону
const bookings = [
  { id: 1, customer: "Тетяна Ковальчук", service: "Масаж «Гаряче каміння»", total: 1200, status: "Підтверджено", date: "2026-05-22", time: "14:00" },
  { id: 2, customer: "Михайло Петренко", service: "Тайський масаж", total: 1400, status: "В процесі", date: "2026-05-22", time: "16:30" },
  { id: 3, customer: "Олена Сидоренко", service: "Шоколадне обгортання", total: 1500, status: "Новий запис", date: "2026-05-23", time: "11:00" },
];

export const metadata = {
  title: "Управління бронюваннями | Spa Oasis",
};

export default function BookingsPage() {
  return (
    <div>
      {/* Заголовок сторінки */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Бронювання послуг</h1>
      
      {/* Таблиця записів */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Клієнт</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Процедура</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Вартість</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Дата й час</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/70 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">{booking.customer}</td>
                <td className="px-6 py-4 text-gray-600">{booking.service}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{booking.total} грн</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                    booking.status === "Підтверджено" ? "bg-green-100 text-green-700" :
                    booking.status === "В процесі" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="text-sm font-medium text-gray-900">{booking.date}</div>
                  <div className="text-xs text-gray-400">{booking.time}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}