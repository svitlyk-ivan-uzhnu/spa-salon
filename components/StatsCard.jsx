// Набір кольорових акцентів для тексту статистики (додали emerald замість amber)
const colorClasses = {
  emerald: 'text-emerald-700',
  green: 'text-green-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
}

export default function StatsCard({ title, value, color = 'emerald' }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <p className={`text-4xl font-bold mt-2 ${colorClasses[color] || colorClasses.emerald}`}>
        {value}
      </p>
    </div>
  )
}