export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заглушка для головного заголовка сторінки */}
      <div className="h-10 bg-gray-200 rounded-xl w-72 mb-8 animate-pulse"></div>

      {/* Сітка skeleton-карток, що повністю копіює структуру нашого page.js */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              {/* Заглушка для заголовка поста (2 рядки) */}
              <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-4 animate-pulse"></div>
              
              {/* Заглушка для тексту поста (3 рядки) */}
              <div className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
            </div>
            
            {/* Заглушка для нижньої інформаційної панелі */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}