import { notFound } from 'next/navigation'

// Імітація бази даних користувачів (наших топ-спеціалістів салону)
const users = {
  '1': { id: 1, name: 'Олександр Довженко', role: 'Майстер масажу' },
  '2': { id: 2, name: 'Яна Сміт', role: 'Косметолог-естетист' },
  '3': { id: 3, name: 'Богдан Якобчук', role: 'Спеціаліст з гідропроцедур' }
}

export default async function UserPage({ params }) {
  const { id } = await params
  const user = users[id]

  // Якщо користувача з таким ID немає у нашій базі — викликаємо локальну 404
  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          👤
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{user.name}</h1>
        <p className="text-emerald-700 font-medium text-sm px-3 py-1 bg-emerald-50 rounded-full inline-block mb-4">
          {user.role}
        </p>
        <p className="text-gray-400 text-xs font-mono">ID облікового запису: #{user.id}</p>
      </div>
    </div>
  )
}