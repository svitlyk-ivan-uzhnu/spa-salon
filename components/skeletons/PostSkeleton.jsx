// Скелетон для звичайного поста або картки процедури
export function PostSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded-md w-32 mt-5"></div>
    </div>
  )
}

// Скелетон для карток статистики в адмінці (Огляд)
export function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded-md w-24 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-16"></div>
    </div>
  )
}

// Скелетон для таблиці керування послугами (5 колонок: Назва, Категорія, Ціна, Доступність, Дії)
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/70">
          <tr>
            {[...Array(5)].map((_, i) => (
              <th key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded-md w-20 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-t border-gray-100">
              {[...Array(5)].map((_, j) => (
                <td key={j} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}