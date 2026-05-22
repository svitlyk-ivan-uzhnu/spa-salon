'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Клієнтська перевірка збігу паролів
    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не збігаються')
      return
    }

    setIsLoading(true)

    try {
      // 1. Надсилаємо запит на створення користувача у наш API роут
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Помилка реєстрації')
        setIsLoading(false)
        return
      }

      // 2. Автоматичний вхід сесії за допомогою NextAuth після успішної реєстрації
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        // Якщо акаунт створено, але сесія не піднялась — шлемо на звичайний логін
        router.push('/auth/login')
        return
      }

      // Перенаправляємо в панель керування
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Щось пішло не так')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-black text-center mb-6 text-gray-900">
          Реєстрація в <span className="text-emerald-600">Spa Oasis</span>
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Ім’я адміністратора / майстра
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Іван Іванов"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Email акаунту
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@oasis.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Пароль (мінімум 6 символів)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Підтвердження пароля
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? 'Створення профілю...' : 'Створити акаунт'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Вже маєте акаунт?{' '}
          <Link href="/auth/login" className="text-emerald-600 hover:underline font-bold">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  )
}