'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Викликаємо провайдер credentials, який ми налаштували в lib/auth.js
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Невірний email або пароль')
        setIsLoading(false)
        return
      }

      // Якщо вхід успішний, перенаправляємо в адмінку
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Щось пішло не так')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-black text-center mb-6 text-gray-900">
          Вхід в <span className="text-emerald-600">Spa Oasis</span>
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Email користувача
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@oasis.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? 'Перевірка даних...' : 'Увійти в панель'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Немає акаунту?{' '}
          <Link href="/auth/register" className="text-emerald-600 hover:underline font-bold">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  )
}