import { Suspense } from 'react'
import { PostSkeleton, StatSkeleton } from '@/components/skeletons/PostSkeleton'

// Швидкий компонент — статистика відвідуваності салону (завантаження 0.5 сек)
async function FastStats() {
  await new Promise(resolve => setTimeout(resolve, 500))
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Візити за сьогодні</h3>
        <p className="text-3xl font-black text-emerald-600">42</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Вільні майстри</h3>
        <p className="text-3xl font-black text-teal-600">7</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Прибуток (грн)</h3>
        <p className="text-3xl font-black text-amber-600">14,800</p>
      </div>
    </div>
  )
}

// Повільний компонент — відгуки клієнтів з API (завантаження 3 сек)
async function SlowPosts() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
  const posts = await response.json()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Свіжі відгуки гостей (Завантаження 3 сек)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 capitalize">{post.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.body}</p>
            </div>
            <div className="mt-4 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <span>⭐⭐⭐⭐⭐</span> • <span>Гість #{post.id}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default function StreamingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Демонстрація Streaming HTML</h1>
      
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-8">
        <p className="text-emerald-800 text-sm font-medium">
          🚀 <strong>Як це працює:</strong> Сервер віддає HTML-код частинами (стрімом). Швидка статистика з'явиться всього через 0.5 сек, а повільні відгуки довантажаться через 3 секунди самостійно.
        </p>
      </div>

      {/* Секція швидкого контенту зі StatSkeleton */}
      <h2 className="text-xl font-bold text-gray-700 mb-3">Стан салону в реальному часі</h2>
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      }>
        <FastStats />
      </Suspense>

      {/* Секція повільного контенту з PostSkeleton */}
      <Suspense fallback={
        <div className="mt-8">
          <div className="h-7 bg-gray-200 rounded-lg w-64 animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        </div>
      }>
        <SlowPosts />
      </Suspense>
    </div>
  )
}