export default async function SlowPage() {
  // Штучно зупиняємо виконання коду на сервері на 3000 мс (3 секунди)
  await new Promise(resolve => setTimeout(resolve, 3000))

  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await response.json()

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Повільна сторінка (Затримка 3 сек)</h1>
      
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
        <p className="text-amber-800 text-sm font-medium">
          Ця сторінка спеціально завантажується на 3 секунди довше. При переході на неї Next.js автоматично покаже індикатор завантаження з файлу <code>loading.js</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 6).map(post => (
          <article 
            key={post.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 capitalize">{post.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.body}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 text-xs font-semibold text-emerald-700">
              Процедура #{post.id}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}