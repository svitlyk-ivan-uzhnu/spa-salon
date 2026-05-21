import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <span className="text-7xl block mb-4 animate-pulse">🔍</span>
        <h1 className="text-6xl font-black text-gray-300 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Користувача не знайдено
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Обліковий запис спеціаліста з таким унікальним ID відсутній у базі даних Spa Oasis.
        </p>
        
        {/* Кнопка повернення до першого існуючого користувача */}
        <Link
          href="/demo/users/1"
          className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide transition shadow-sm active:scale-98"
        >
          Дивитись профіль майстра #1 &rarr;
        </Link>
      </div>
    </div>
  )
}