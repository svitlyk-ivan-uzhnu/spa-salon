'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DrinkForm from '@/components/DrinkForm'

export default function NewDrinkPage() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.errors?.join(', ') || data.error || 'Помилка створення процедури'
        )
      }

      router.push('/dashboard/services')
    } catch (err) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-2">
      <Link href="/dashboard/services"
        className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline mb-4 inline-block">
        &larr; Назад до каталогу
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-black mb-6 text-gray-900 tracking-tight">
          Додати нову спа-процедуру
        </h1>
        <DrinkForm
          onSubmit={handleSubmit}
          submitLabel="Створити послугу"
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </div>
  )
}