export default async function CachedPage() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const post = await response.json()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Закешований пост</h1>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
        <p className="text-sm text-blue-800">
          <strong>Production:</strong> Цей пост закешований назавжди (після build). Timestamp не змінюється при оновленні сторінки.
        </p>
        <p className="text-sm text-blue-700 mt-1.5 text-xs">
          * В <code>npm run dev</code> кешування не працює &mdash; час оновлюється при кожному запиті. Щоб побачити різницю, запустіть <code>npm run build &amp;&amp; npm start</code>.
        </p>
      </div>

      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 capitalize">{post.title}</h2>
        <p className="text-gray-600 leading-relaxed">{post.body}</p>
        <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-gray-50 font-medium">
          Завантажено: {new Date().toLocaleTimeString()}
        </p>
      </article>
    </div>
  )
}