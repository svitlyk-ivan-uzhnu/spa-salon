export default async function PostsPage() {
  // Запит виконується безпосередньо на сервері під час генерації сторінки
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await response.json()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Пости з JSONPlaceholder
      </h1>

      {/* Сітка для постів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 9).map(post => (
          <article
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 capitalize">
                {post.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                {post.body}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-400 font-medium">
              <span>ID Посту: #{post.id}</span>
              <span>Автор: Користувач {post.userId}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}