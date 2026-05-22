'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DrinkForm from '@/components/DrinkForm'

export default function EditDrinkPage() {
  const { id } = useParams()
  const router = useRouter()
  const [drink, setDrink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Процедуру не знайдено в базі даних')
        return res.json()
      })
      .then((data) => {
        setDrink(data)
        setLoading(false)
      })
      .catch((err) => {
        setLoadError(err.message)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (formData) => {
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.errors?.join(', ') || data.error || 'Помилка оновлення даних'
        )
      }

      // Після успішного збереження повертаємо адміна назад до списку послуг
      router.push('/dashboard/services')
    } catch (err) {
      setSubmitError(err.message)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-2 space-y-4">
        <div className="h-5 bg-gray-200 rounded-lg w-32 mb-4 animate-pulse"></div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-40 bg-gray-150 rounded-xl w-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="p-2">
        <Link href="/dashboard/services"
          className="text-emerald-700 font-semibold hover:underline mb-4 inline-block">
          &larr; Назад до каталогу
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto mt-12">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Помилка завантаження</h2>
          <p className="text-gray-600">{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2">
      <Link href="/dashboard/services"
        className="text-emerald-700 font-semibold hover:underline mb-4 inline-block">
        &larr; Скасувати та повернутися
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-black mb-6 text-gray-900 tracking-tight">
          Редагувати: {drink?.name}
        </h1>
        <DrinkForm
          initialData={drink}
          onSubmit={handleSubmit}
          submitLabel="Зберегти зміни"
          isSubmitting={isSubmitting}
          error={submitError}
        />
      </div>
    </div>
  )
}